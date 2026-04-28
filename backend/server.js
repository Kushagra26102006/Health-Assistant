require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Load responses data
const responsesPath = path.join(__dirname, '../data/responses.json');
let responsesData = {};
try {
  const data = fs.readFileSync(responsesPath, 'utf8');
  responsesData = JSON.parse(data);
} catch (err) {
  console.error("Error reading responses.json:", err);
}

// Initialize Gemini API
let genAI = null;
if (process.env.API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.API_KEY);
} else {
  console.warn("WARNING: API_KEY is missing in the .env file. AI responses will be disabled.");
}

const DISCLAIMER = "\n\n*Disclaimer: This is not a medical diagnosis. Please consult a doctor for serious issues.*";

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const lowerCaseMessage = message.toLowerCase();
    
    // 1. Keyword-based matching
    let matchedResponse = null;
    if (lowerCaseMessage.includes('fever')) {
      matchedResponse = responsesData['fever'];
    } else if (lowerCaseMessage.includes('headache')) {
      matchedResponse = responsesData['headache'];
    } else if (lowerCaseMessage.includes('cold')) {
      matchedResponse = responsesData['cold'];
    } else if (lowerCaseMessage.includes('cough')) {
      matchedResponse = responsesData['cough'];
    } else if (lowerCaseMessage.includes('diet') || lowerCaseMessage.includes('food')) {
      matchedResponse = responsesData['diet'];
    }

    if (matchedResponse) {
      return res.json({ response: matchedResponse + DISCLAIMER });
    }

    // 2. AI Fallback
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const prompt = `You are a helpful health assistant chatbot. Provide a brief, general advice for the following query. Do not provide specific medical diagnoses. Query: ${message}`;
        const result = await model.generateContent(prompt);
        const aiResponse = result.response.text();
        return res.json({ response: aiResponse + DISCLAIMER });
      } catch (aiError) {
        console.error("Gemini API Error:", aiError);
        return res.json({ response: responsesData['default'] + "\n(AI service is currently unavailable.)" + DISCLAIMER });
      }
    } else {
      // No keyword matched and no AI configured
      return res.json({ response: responsesData['default'] + "\n(AI module is currently disabled due to missing API configuration.)" + DISCLAIMER });
    }

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
