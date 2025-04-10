import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import { OpenAI } from 'openai';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api', async (req, res) => {
  res.status(200).send({
    message: 'Hello from the backend'
  });
});

app.post('/api', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Use the GPT-4 model or GPT-3.5 for chat-based interactions
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // You can switch this to 'gpt-4' if your plan supports it
      messages: [
        
        { role: 'system', content: 'You are a Virtual Assistant that can clear doubts and resolve conceptual contradictions.' }, // Optional system message
        { role: 'user', content: prompt } // User's input
      ],
      temperature: 0.7, // Adjust creativity of the model
      max_tokens: 2000, // Adjust length of the response
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0
    });

    // Send back the bot's response
    res.status(200).send({
      bot: response.choices[0].message.content // Correct way to extract the message content
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

// Export the Express API
module.exports = app;