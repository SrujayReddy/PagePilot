chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "generateToC") {
    const prompt = `Here is the content of a webpage:
    ${message.content.slice(0, 16000)}
    Create a Table of Contents for the website. Dont include any other text.
    Start each entry with * and use consistent indentation.`;

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
        console.log("Gemini API response:", data);
        const toc = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        sendResponse({ toc: toc || "No ToC generated." });
      })
      .catch(err => {
        console.error("Gemini API error:", err);
        sendResponse({ toc: "Error generating ToC." });
      });

    return true; // required for async sendResponse
  }
});