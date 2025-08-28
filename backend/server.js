const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chat');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_SECRET = process.env.GEMINI_API_SECRET;

const app = express();
app.use(cors());

app.use('/api', chatRoute);

app.use(express.json())

// Mock responses for now (Later: Replace with Gemini AI API call)
const sampleQuotes = {
  happy: "Keep smiling, the world needs your light! 🌞",
  sad: "Tough times don’t last, but tough people do. 💪",
  stressed: "Take a deep breath, you are stronger than you think. 🌸",
  default: "No matter the mood, remember: You are amazing! 🌟",
};

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

app.post("/get-quote", (req, res) => {
  const mood = req.body.mood.toLowerCase();
  const quote = sampleQuotes[mood] || sampleQuotes.default;
  res.json({ quote });
});

console.log("Gemini API Key:", GEMINI_API_KEY); // For testing only

const axios = require('axios');

async function getAccountBalance() {
  try {
    const response = await axios.get('https://api.gemini.com/v1/balances', {
      headers: {
        'X-GEMINI-APIKEY': GEMINI_API_KEY,
        'X-GEMINI-PAYLOAD': '',      // depends on their auth requirements
        'X-GEMINI-SIGNATURE': ''     // depends on their auth requirements
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
}

getAccountBalance();

app.listen(8000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
