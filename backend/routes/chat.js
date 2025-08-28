const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // or axios

// =======================
// PROMPTS
// =======================

// Zero-shot system prompt
const zeroShotPrompt = `
You are AuraBot, a friendly AI best friend. 
Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.
Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.
Generate responses based only on the user’s message without any example inputs or outputs. This is zero-shot prompting.
`;

// One-shot system prompt
const oneShotPrompt = `
You are AuraBot, a friendly AI best friend. 
Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.
Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.

Here is an example:

User: "I feel stressed and anxious today."
AI: "I understand how stressful days can be. Take a deep breath! 🌸 Here's a quote for you: 'Every day may not be good, but there is something good in every day.' You got this!"

Now respond to the user's input in a similar empathetic and motivational way.
`;

// =======================
// SELECT PROMPT
// =======================

// Toggle between zero-shot or one-shot
const systemPrompt = oneShotPrompt; // change to zeroShotPrompt if you want zero-shot

// =======================
// POST ROUTE
// =======================

router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  try {
    // Call AI API (OpenAI in this example)
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