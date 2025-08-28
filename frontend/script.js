async function sendMood() {
  const mood = document.getElementById("moodInput").value;
  const quoteBox = document.getElementById("quoteBox");

  if (!mood) {
    quoteBox.innerHTML = "⚠️ Please enter your mood!";
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/get-quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mood }),
    });

    const data = await response.json();
    quoteBox.innerHTML = "💡 " + data.quote;
  } catch (error) {
    quoteBox.innerHTML = "❌ Server error. Try again later.";
  }
}
