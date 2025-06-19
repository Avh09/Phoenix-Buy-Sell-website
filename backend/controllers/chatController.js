const asyncHandler = require('express-async-handler');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

// Add debug logging
console.log('Environment check:', {
  apiKeyExists: !!process.env.GEMINI_API_KEY,
  apiKeyLength: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.length : 0
});

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const chat = asyncHandler(async (req, res) => {
  try {
    console.log('Received request body:', {
      promptLength: req.body.prompt?.length,
      historyLength: req.body.conversationHistory?.length
    });

    if (!req.body.prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('Model initialized');

    let response;
    try {
      // Try a simple generation first
      const result = await model.generateContent(req.body.prompt);
      response = result.response.text();
      console.log('Generated response length:', response?.length);
    } catch (genError) {
      console.error('Generation error:', genError);
      throw genError;
    }

    res.json({ response });
  } catch (error) {
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      details: error.details || 'No additional details'
    });

    res.status(500).json({ 
      message: 'Error communicating with AI model',
      error: error.message,
      type: error.constructor.name,
      details: error.details || 'No additional details'
    });
  }
});

module.exports = { chat };