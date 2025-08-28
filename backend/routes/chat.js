const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // or axios

// Zero-shot system prompt
const systemPrompt = `
You are AuraBot, a friendly AI best friend. Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.
Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.
`;

// POST route for AI chat
router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  try {
    // Example using OpenAI API (replace with your key)
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages
      })
    });

    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

module.exports = router;
