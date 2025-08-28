const express = require('express');
const router = express.Router();
const fetch = require('node-fetch'); // or axios if you prefer

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

// Multi-shot system prompt
const multiShotPrompt = `
You are AuraBot, a friendly AI best friend. Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.
Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.

Here are some examples:

User: "I feel stressed and anxious today."
AI: "I understand how stressful days can be. Take a deep breath! 🌸 Here's a quote for you: 'Every day may not be good, but there is something good in every day.' You got this!"

User: "I am feeling sad and lonely."
AI: "It’s okay to feel sad sometimes. 💛 Remember: 'Happiness can be found even in the darkest of times, if one only remembers to turn on the light.' You are not alone!"

User: "I feel happy and excited!"
AI: "Yay! That’s wonderful to hear! 🌟 Keep spreading your joy! Here's a quote: 'Happiness is not something ready made. It comes from your own actions.' Enjoy your day!"

Now respond to the user's input in a similar empathetic and motivational way.
`;

// Dynamic system prompt generator
function getDynamicPrompt(userMood) {
  return `
You are AuraBot, a friendly AI best friend. 
Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.

User’s current mood: "${userMood}"

Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.

Respond to the user based on their mood and provide a motivational or comforting quote that fits their feelings.
`;
}

// =======================
// SELECT PROMPT
// =======================

// Options: zeroShotPrompt | oneShotPrompt | multiShotPrompt | dynamicPrompt
// Example: Using dynamic prompting
// const systemPrompt = zeroShotPrompt; 
// const systemPrompt = oneShotPrompt; 
// const systemPrompt = multiShotPrompt; 
// For dynamic prompting, systemPrompt will be generated inside the route

// =======================
// POST ROUTE
// =======================

router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  // If using dynamic prompting, generate prompt per user input
  const systemPrompt = getDynamicPrompt(userMessage);

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