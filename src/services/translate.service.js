const axios = require("axios");

async function translateToIndonesian(text) {
    const res = await axios.post("https://libretranslate.com/translate", {
        q: text,
        source: "en",
        target: "id",
        format: "text",
    });
    return res.data.translatedText;
}

module.exports = { translateToIndonesian };
