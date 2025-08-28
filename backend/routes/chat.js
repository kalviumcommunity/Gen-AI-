const express = require('express');
const router = express.Router();
const axios = require('axios');

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

// Chain-of-Thought system prompt
const chainOfThoughtPrompt = `
You are AuraBot, a friendly AI best friend. 
Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.

Follow this approach (Chain of Thought):
1. Read the user's input carefully.
2. Identify the user's mood or emotion.
3. Think about the most empathetic way to address the user's feelings.
4. Choose a positive or motivational quote that fits the mood.
5. Combine your understanding and the quote into a final empathetic response.

Now respond to the user's input in a thoughtful and motivational way.
`;

// =======================
// SELECT PROMPT
// =======================

const PROMPT_TYPE = 'dynamic'; // Change: zero | one | multi | dynamic | cot

function selectPrompt(userMessage) {
  switch (PROMPT_TYPE) {
    case 'zero':
      return zeroShotPrompt;
    case 'one':
      return oneShotPrompt;
    case 'multi':
      return multiShotPrompt;
    case 'dynamic':
      return getDynamicPrompt(userMessage);
    case 'cot':
      return chainOfThoughtPrompt;
    default:
      return zeroShotPrompt;
  }
}

// =======================
// EVALUATION DATASET
// =======================

const evaluationDataset = [
  "I feel stressed and anxious today.",
  "I am feeling sad and lonely.",
  "I feel happy and excited!",
  "I feel unmotivated about my work.",
  "I feel nervous about my exams."
];

// =======================
// POST ROUTE
// =======================

router.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const systemPrompt = selectPrompt(userMessage);

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// =======================
// TEST ROUTE
// =======================

router.get('/test', async (req, res) => {
  const results = [];

  for (const sampleInput of evaluationDataset) {
    try {
      const systemPrompt = selectPrompt(sampleInput);
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: sampleInput }
      ];

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: messages
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          }
        }
      );

      results.push({
        input: sampleInput,
        output: response.data.choices[0].message.content
      });
    } catch (error) {
      results.push({
        input: sampleInput,
        error: error.message
      });
    }
  }

  res.json(results);
});

module.exports = router;