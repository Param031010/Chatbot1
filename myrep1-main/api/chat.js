import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { prompt } = req.body;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a Virtual Assistant that can clear doubts and resolve conceptual contradictions.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0.5,
        presence_penalty: 0
      });

      res.status(200).json({
        bot: response.choices[0].message.content
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 