const axios = require("axios");

const askDeepSeek = async (messages) => {
    try {
        const res = await axios.post(
            process.env.DEEPSEEK_BASE_URL,
            {
                model: process.env.DEEPSEEK_MODEL,
                messages,
                temperature: 0.7,
                max_tokens: 2048,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return res.data.choices[0].message;
    } catch (err) {
        console.error("DeepSeek API error:", err.response?.data || err.message);
        throw new Error("Failed to connect to AI service");
    }
};

module.exports = { askDeepSeek };
