import OpenAI from "openai";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if API key is loaded
if (!process.env.OPENAI_API_KEY) {
  console.error('ERROR: OpenAI API key is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test endpoint
app.get('/', (req, res) => {
  // Add API key check to test endpoint
  const apiKeyStatus = process.env.OPENAI_API_KEY ? 'API key is set' : 'API key is missing';
  res.json({ 
    message: 'API is working!',
    apiStatus: apiKeyStatus
  });
});

// Main chat endpoint
app.post('/', async (req, res) => {
  try {
    // Log API key length for debugging (don't log the actual key)
    console.log('API Key length:', process.env.OPENAI_API_KEY?.length);
    console.log('API Key prefix:', process.env.OPENAI_API_KEY?.substring(0, 5));

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'No prompt provided',
        message: 'Please provide a prompt in the request body'
      });
    }

    // Try GPT-4 first, fallback to GPT-3.5 if not available
    let model = "gpt-4";
    try {
      const response = await openai.chat.completions.create({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant specializing in computer science and programming concepts. Provide detailed, accurate, and well-structured answers."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0.2,
        presence_penalty: 0.2
      });

      return res.status(200).json({
        bot: response.choices[0].message.content
      });
    } catch (modelError) {
      if (modelError.message?.includes('GPT-4')) {
        // Fallback to GPT-3.5-turbo
        model = "gpt-3.5-turbo";
        const response = await openai.chat.completions.create({
          model: model,
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant specializing in computer science and programming concepts. Provide detailed, accurate, and well-structured answers."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1,
          frequency_penalty: 0.2,
          presence_penalty: 0.2
        });

        return res.status(200).json({
          bot: response.choices[0].message.content,
          note: "Using GPT-3.5-turbo as fallback"
        });
      }
      throw modelError;
    }

  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error.error?.code === 'invalid_api_key') {
      return res.status(401).json({
        error: 'Authentication Error',
        message: 'Please check your OpenAI API key. Make sure it starts with "sk-" and is copied correctly.'
      });
    }

    return res.status(500).json({
      error: 'OpenAI API Error',
      message: error.message,
      details: error.response?.data || 'No additional details available'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('API Key status:', process.env.OPENAI_API_KEY ? 'Present' : 'Missing');
}); 