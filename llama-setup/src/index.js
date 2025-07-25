import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";
import { fileURLToPath } from "url";
import path from "path";

// Helper untuk mendapatkan __dirname di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(express.json());

let chatSession;
let knowledgeEmbeddings = [];
let embeddingPipeline;

function chunkMarkdownByHeaders(markdownContent) {
    const parts = markdownContent.split(/\n(?=## )/);
    const allChunks = [];

    const processPart = (partContent, defaultParent) => {
        const parentMatch = partContent.match(/^## (.*)/);
        const parentHeader = parentMatch
            ? parentMatch[1].trim()
            : defaultParent;

        const subChunks = partContent.split(/\n(?=### )/);

        const introContent = subChunks[0];
        const introMatch = introContent.match(/^## .*/);
        const cleanIntro = introMatch
            ? introContent.substring(introMatch[0].length).trim()
            : introContent.trim();

        if (cleanIntro) {
            allChunks.push({
                metadata: {
                    parent_section_l2: parentHeader,
                    section_l3: "Introduction",
                },
                content: introContent.trim(),
            });
        }

        for (let i = 1; i < subChunks.length; i++) {
            const chunkText = subChunks[i];
            const headerMatch = chunkText.match(/^### (.*)/);
            const header = headerMatch
                ? headerMatch[1].trim()
                : "Unnamed Section";
            allChunks.push({
                metadata: {
                    parent_section_l2: parentHeader,
                    section_l3: header,
                },
                content: chunkText.trim(),
            });
        }
    };

    const firstPart = parts.shift();
    const mainTitleMatch = firstPart.match(/^# (.*)/);
    const mainTitle = mainTitleMatch ? mainTitleMatch[1].trim() : "Document";
    processPart(firstPart, mainTitle);

    parts.forEach((part) => processPart(part, "Unnamed Part"));

    return allChunks;
}

async function loadKnowledgeChunks() {
    console.log("Loading knowledge base...");
    const markdownPath = path.join(
        __dirname,
        "knowledge",
        "markdown.md"
    );
    const markdown = fs.readFileSync(markdownPath, "utf8");

    const structuredChunks = chunkMarkdownByHeaders(markdown);
    console.log(`✅ Created ${structuredChunks.length} structured chunks.`);

    console.log("Generating embeddings for all chunks...");
    knowledgeEmbeddings = await Promise.all(
        structuredChunks.map(async (chunkObj) => ({
            chunkObject: chunkObj, 
            embedding: await getEmbedding(chunkObj.content),
        }))
    );
    console.log("✅ Knowledge chunks and embeddings loaded");
}

async function loadEmbeddingPipeline() {
    embeddingPipeline = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
    );
    console.log("✅ Embedding pipeline loaded");
}

async function getEmbedding(text) {
    const output = await embeddingPipeline(text, {
        pooling: "mean",
        normalize: true,
    });
    return Array.from(output.data);
}

function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    if (normA === 0 || normB === 0) return 0; 
    return dotProduct / (normA * normB);
}

async function retrieveRelevantChunks(query, topK = 3) {
    const queryEmbedding = await getEmbedding(query);

    const similarities = knowledgeEmbeddings.map(
        ({ chunkObject, embedding }) => {
            const score = cosineSimilarity(queryEmbedding, embedding);
            return { chunk: chunkObject, score };
        }
    );

    return similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((item) => item.chunk); 
}

async function setup() {
    await loadEmbeddingPipeline();
    await loadKnowledgeChunks();

    const llama = await getLlama();
    const modelPath = path.join(
        __dirname,
        "models",
        "qwen1_5-0_5b-chat-q8_0.gguf"
    );
    const model = await llama.loadModel({ modelPath });

    const context = await model.createContext();
    chatSession = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });

    console.log("✅ Llama RAG server initialized");
}

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res
            .status(400)
            .json({ status: "fail", message: "prompt is required" });
    }

    try {
        console.time("totalChat");
        console.time("retrieveChunks");
        const contextChunks = await retrieveRelevantChunks(prompt);
        console.timeEnd("retrieveChunks");
        const contextText = contextChunks
            .map((chunk) => {
                const parentHeader = chunk.metadata.parent_section_l2;
                const sectionHeader = chunk.metadata.section_l3;
                const cleanContent = chunk.content.replace(/^#+ .*/, "").trim();
                return `Reference from section "${parentHeader} -> ${sectionHeader}":\n${cleanContent}`;
            })
            .join("\n\n---\n\n");

        const finalPrompt = `Use the following knowledge base references to answer the question. Your answer must be based on the provided references.\n\nHere are some references from the knowledge base:\n\n${contextText}\n\nQuestion: ${prompt}\nAnswer:`;

        console.time("chatPrompt");
        const response = await chatSession.prompt(finalPrompt, {
            maxTokens: 250,
            temperature: 0.5,
            stop: ["\n\n", "Question:", "Q:"],
        });
        console.timeEnd("chatPrompt");
        console.timeEnd("totalChat");

        res.json({
            result: response,
            context: contextChunks.map((c) => c.metadata),
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

setup().then(() => {
    app.listen(4000, () =>
        console.log("✅ Llama RAG server ready on port 4000")
    );
});