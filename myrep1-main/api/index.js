const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  console.log('API Request received:', req.method);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    console.log('Health check request');
    res.status(200).json({ 
      message: 'API is working',
      timestamp: new Date().toISOString()
    });
    return;
  }

  if (req.method === 'POST') {
    console.log('Received POST request');
    try {
      const { prompt } = req.body;
      console.log('Received prompt:', prompt);

      if (!prompt) {
        console.error('No prompt provided');
        return res.status(400).json({ error: 'Prompt is required' });
      }

      if (!process.env.OPENAI_API_KEY) {
        console.error('OpenAI API key is missing');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      console.log('Calling OpenAI API...');
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

      console.log('OpenAI API response received');
      res.status(200).json({
        bot: response.choices[0].message.content
      });
    } catch (error) {
      console.error('OpenAI API Error:', error);
      res.status(500).json({ 
        error: 'An error occurred while processing your request',
        details: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else {
    console.error('Invalid method:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}; 