const axios = require("axios");

/**
 * @param {string} prompt
 * @returns {Promise<string>}
 */
async function getAIResponse(prompt) {
    try {
        const response = await axios.post("http://localhost:4000/chat", {
            model: "qwen1_5-0_5b-chat-q8_0",
            prompt,
            stream: false,
        });

        // GANTI dari response.data.content → response.data.result
        const aiMessage = response.data?.result;
        if (!aiMessage) {
            throw new Error(
                "AI response 'result' property is empty or missing."
            );
        }

        return { content: aiMessage };
    } catch (error) {
        console.error("❌ Error in getAIResponse:", error.message);
        return { content: "AI tidak dapat memberikan respon saat ini." };
    }
}

module.exports = { getAIResponse };
