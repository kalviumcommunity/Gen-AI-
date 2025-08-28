const express = require("express");
const cors = require("cors");
const chatRoute = require('./routes/chat');
require('dotenv').config();
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_SECRET = process.env.GEMINI_API_SECRET;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', chatRoute);

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// Mock quote route
const sampleQuotes = {
  happy: "Keep smiling, the world needs your light! 🌞",
  sad: "Tough times don’t last, but tough people do. 💪",
  stressed: "Take a deep breath, you are stronger than you think. 🌸",
  default: "No matter the mood, remember: You are amazing! 🌟",
};

app.post("/get-quote", (req, res) => {
  const mood = req.body.mood.toLowerCase();
  const quote = sampleQuotes[mood] || sampleQuotes.default;
  res.json({ quote });
});

// Gemini API testing (optional, needs proper auth)
async function getAccountBalance() {
  try {
    const response = await axios.get('https://api.gemini.com/v1/balances', {
      headers: {
        'X-GEMINI-APIKEY': GEMINI_API_KEY,
        'X-GEMINI-PAYLOAD': '',      // TODO: set payload
        'X-GEMINI-SIGNATURE': ''     // TODO: set signature
      }
    });
    console.log(response.data);
  } catch (error) {
    console.error(error.response?.data || error.message);
  }
}

// getAccountBalance(); // Uncomment once auth is ready

// Server listen
app.listen(8000, () => {
  console.log("🚀 Server running on http://localhost:8000");
});