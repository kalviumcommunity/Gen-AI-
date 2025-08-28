const systemPrompt = `
You are AuraBot, a friendly AI best friend. Your job is to cheer up the user, provide mood-relief, and suggest positive quotes. 
Always respond warmly, empathetically, and positively.
Follow RTFC: Read the user's input carefully, Think about context, Formulate a helpful response, and Communicate clearly.
`;

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message; // user's mood or request

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];

  // send 'messages' to AI API and return AI response
});
