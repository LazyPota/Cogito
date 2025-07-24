// llama-runner.mjs (ESM only)
import { getLlama, LlamaChatSession } from "node-llama-cpp";
import express from "express";

const app = express();
app.use(express.json());

let chatSession;

async function setup() {
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
    const response = await chatSession.prompt(prompt);
    res.json({ result: response });
});

setup().then(() => {
    app.listen(4000, () => console.log("Llama server ready on port 4000"));
});
