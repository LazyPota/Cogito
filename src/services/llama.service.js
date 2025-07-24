const axios = require("axios");

const getAIResponse = async (prompt) => {
  try {
    const response = await axios.post("localhost:4000/chat", {
      model: "qwen1_5-0_5b-chat-q8_0",
      prompt,
      stream: false,
    });

    // Remove or comment out debug logs once confirmed
    // console.log("DEBUG: Full Axios Response Object:", response);
    // console.log("DEBUG: Response Data:", response.data);
    // console.log("DEBUG: Response Data Type:", typeof response.data);

    // THIS IS THE CRUCIAL CHANGE: Access 'content' property
    const aiMessage = response.data?.content;

    // Remove or comment out debug logs once confirmed
    // console.log("DEBUG: Extracted aiMessage (content):", aiMessage);
    // console.log("DEBUG: Type of aiMessage:", typeof aiMessage);

    if (!aiMessage) {
      // This error will be caught if aiMessage is null, undefined, or empty string
      throw new Error("AI response 'content' property is empty or missing."); // Updated error message
    }

    return { content: aiMessage };
  } catch (error) {
    if (error.response) {
      console.error("❌ Error in getAIResponse (Server Response):", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("❌ Error in getAIResponse (No Response from Server):", error.message);
    } else {
      console.error("❌ Error in getAIResponse (Request Setup Error):", error.message);
    }
    return { content: "AI tidak dapat memberikan respon saat ini." };
  }
};

module.exports = { getAIResponse };