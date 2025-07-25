const express = require("express");
const translate = require("@vitalets/google-translate-api");

const app = express();
app.use(express.json());

app.post("/detect", async (req, res) => {
    try {
        const { text } = req.body;
        const result = await translate(text);
        res.json({ language: result.from.language.iso });
    } catch (err) {
        res.status(500).json({ error: "Language detection failed." });
    }
});

app.post("/translate/id-en", async (req, res) => {
    try {
        const { text } = req.body;
        const result = await translate(text, { from: "id", to: "en" });
        res.json({ translated: result.text });
    } catch (err) {
        res.status(500).json({ error: "Translation failed." });
    }
});

app.post("/translate/en-id", async (req, res) => {
    try {
        const { text } = req.body;
        const result = await translate(text, { from: "en", to: "id" });
        res.json({ translated: result.text });
    } catch (err) {
        res.status(500).json({ error: "Translation failed." });
    }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Translation API running on port ${PORT}`);
});
