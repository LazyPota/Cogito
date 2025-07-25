import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from "express";
import fs from "fs";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

let chatSession;
let knowledgeChunks = [];

function loadKnowledgeChunks() {
    const markdown = fs.readFileSync("./src/knowledge/markdown.md", "utf8");
    knowledgeChunks = markdown
        .split(/\n\s*\n/) 
        .filter((chunk) => chunk.trim().length > 50);
}

async function getEmbedding(text) {
    const response = await axios.post(
        "https://api-inference.huggingface.co/embeddings/sentence-transformers/all-MiniLM-L6-v2",
        { inputs: text },
        {
            headers: {
                Authorization: `Bearer ${process.env.HF_API_KEY}`,
            },
        }
    );
    return response.data.embedding;
}

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (normA * normB);
}

async function retrieveRelevantChunks(query, topK = 3) {
    const queryEmbedding = await getEmbedding(query);
    const similarities = await Promise.all(
        knowledgeChunks.map(async (chunk) => {
            const chunkEmbedding = await getEmbedding(chunk);
            const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
            return { chunk, score };
        })
    );
    return similarities
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map((item) => item.chunk);
}

async function setup() {
    loadKnowledgeChunks();
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: "./src/models/qwen1_5-0_5b-chat-q8_0.gguf",
        gpu: false,
    });
    const context = await model.createContext();
    chatSession = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });
}

app.post("/chat", async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res
            .status(400)
            .json({ status: "fail", message: "prompt is required" });
    }

    try {
        const contextChunks = await retrieveRelevantChunks(prompt);
        const contextText = contextChunks.join("\n\n");
        const finalPrompt = `Berikut adalah referensi dari knowledge base:\n\n${contextText}\n\nPertanyaan: ${prompt}\nJawaban:`;

        const response = await chatSession.prompt(finalPrompt);
        res.json({ result: response });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
});

setup().then(() => {
    app.listen(4000, () => console.log("Llama RAG server ready on port 4000"));
});
