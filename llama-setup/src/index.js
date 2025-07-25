import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
import { pipeline } from "@xenova/transformers";

dotenv.config();

const app = express();
app.use(express.json());

let chatSession;
let knowledgeChunks = [];
let knowledgeEmbeddings = [];
let embeddingPipeline;

async function loadKnowledgeChunks() {
    const markdown = fs.readFileSync("./src/knowledge/markdown.md", "utf8");
    knowledgeChunks = markdown
        .split(/\n\s*\n/)
        .filter((chunk) => chunk.trim().length > 50);

    knowledgeEmbeddings = await Promise.all(
        knowledgeChunks.map(async (chunk) => ({
            chunk,
            embedding: await getEmbedding(chunk),
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
    return output.data;
}

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

async function retrieveRelevantChunks(query, topK = 3) {
    const queryEmbedding = await getEmbedding(query);
    const similarities = knowledgeEmbeddings.map(({ chunk, embedding }) => {
        const score = cosineSimilarity(queryEmbedding, embedding);
        return { chunk, score };
    });

    return similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((item) => item.chunk);
}

async function setup() {
    await loadEmbeddingPipeline();
    await loadKnowledgeChunks();

    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: "./src/models/qwen1_5-0_5b-chat-q8_0.gguf",
        gpu: false,
    });

    const context = await model.createContext();
    chatSession = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });

    console.log("✅ Llama RAG server initialized");
}

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({
            status: "fail",
            message: "prompt is required",
        });
    }

    try {
        console.time("totalChat");
        console.time("retrieveChunks");
        const contextChunks = await retrieveRelevantChunks(prompt);
        console.timeEnd("retrieveChunks");

        const contextText = contextChunks.join("\n\n");
        const finalPrompt = `Here is some reference from the knowledge base:\n\n${contextText}\n\nQuestion: ${prompt}\nAnswer:`;

        console.time("chatPrompt");
        const response = await chatSession.prompt(finalPrompt, {
            maxTokens: 200,
            temperature: 0.7, 
            stop: ["\n\n", "Question:", "Q:"],
        });
        console.timeEnd("chatPrompt");

        console.timeEnd("totalChat");

        res.json({ result: response });
    } catch (err) {
        console.error("❌ Error:", err);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

setup().then(() => {
    app.listen(4000, () => console.log("Llama RAG server ready on port 4000"));
});
