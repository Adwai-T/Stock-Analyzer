const axios = require('axios');

async function queryLocalLLM(prompt) {
  try {
    const response = await axios.post(
      'http://localhost:1234/v1/chat/completions',
      {
        model: "local-model",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

module.exports = { queryLocalLLM };