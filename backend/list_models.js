require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  if (!process.env.API_KEY) {
    console.error("API_KEY missing in .env");
    return;
  }
  const genAI = new GoogleGenerativeAI(process.env.API_KEY);
  try {
    // There isn't a direct listModels in the client library that is easy to call without raw fetch sometimes, 
    // but let's try to just test a few common ones.
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.0-pro'];
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("test");
        console.log(`✅ Model ${modelName} is working!`);
        return modelName;
      } catch (e) {
        console.log(`❌ Model ${modelName} failed: ${e.message}`);
      }
    }
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
