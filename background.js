chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generateTitle") {
    const prompt = `Here is the content of a webpage:\n\n${message.content.slice(0, 4000)}\n\nCreate a Table of Contents for the website. Dont include any other text.`;

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBAwFWt3cCAKOO7G5z3PSaOotoWDaO07KU", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log("Gemini API response:", data); // 👈 debugging line
        const title = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        sendResponse({ title: title || "No title generated." });
      })
      .catch(err => {
        console.error("Gemini API error:", err);
        sendResponse({ title: "Error generating title." });
      });

    return true; // required for async sendResponse
  }
});