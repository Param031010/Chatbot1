const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  try {
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

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({
        error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.'
      });
    }

    if (req.method === 'GET') {
      return res.status(200).json({
        message: 'API is working',
        apiKeyConfigured: !!process.env.OPENAI_API_KEY,
        timestamp: new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      const { prompt } = req.body;

      if (!prompt) {
        return res.status(400).json({
          error: 'No prompt provided',
          message: 'Please provide a prompt in the request body'
        });
      }

      try {
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

        return res.status(200).json({
          bot: response.choices[0].message.content
        });
      } catch (openaiError) {
        console.error('OpenAI API Error:', openaiError);
        return res.status(500).json({
          error: 'OpenAI API Error',
          message: openaiError.message,
          details: openaiError.response?.data || 'No additional details available'
        });
      }
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({
      error: 'Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 