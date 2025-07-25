const axios = require("axios");
const qs = require("qs");

const translateToIndonesian = async (text) => {
    try {
        const data = qs.stringify({
            q: text,
            source: "en",
            target: "id",
            format: "text",
        });

        const response = await axios.post(
            "http://localhost:5000/translate",
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.translatedText;
    } catch (err) {
        console.error(
            "Translate to Indonesian error:",
            err.response?.data || err.message
        );
        return text;
    }
};

const translateToEnglish = async (text) => {
    try {
        const data = qs.stringify({
            q: text,
            source: "id",
            target: "en",
            format: "text",
        });

        const response = await axios.post(
            "http://localhost:5000/translate",
            data,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        return response.data.translatedText;
    } catch (err) {
        console.error(
            "Translate to English error:",
            err.response?.data || err.message
        );
        return text;
    }
};

module.exports = {
    translateToIndonesian,
    translateToEnglish,
};
