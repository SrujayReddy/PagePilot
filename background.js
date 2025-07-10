chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "findHeaders") {
    console.log("🔍 Received request to find headers.");
    
    const prompt = `
You are given a list of short visible text blocks from a webpage. 
Some of them may be section headers (like “Introduction”, “Methodology”, “Results”, etc.), while others may be menus, footers, or boilerplate. 
Identify the blocks that are likely to be section headers in a real article or report.
Do not include nav links, copyright notices, or site-level elements.

Return ONLY a JSON array of exact matching strings, using double quotes. 

TEXT BLOCKS:
${message.content}

HEADERS (as an array of strings):
`;

    fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBAwFWt3cCAKOO7G5z3PSaOotoWDaO07KU", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    })
      .then(res => res.json())
      .then(data => {
      const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
      console.log("🧠 Gemini raw response:\n", raw);

      let cleaned = raw.trim();
      if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/```[a-zA-Z]*\n?/, "").replace(/```$/, "").trim();
      }

      let headers;
      try {
        headers = JSON.parse(cleaned);
        console.log("✅ Parsed Gemini headers:", headers);
      } catch (e) {
        console.warn("⚠️ Could not parse response:", cleaned);
        headers = [];
      }
        sendResponse({ headers });
      })
      .catch(err => {
        console.error("❌ Gemini API error:", err);
        sendResponse({ headers: [] });
      });

    return true; // keep sendResponse alive
  }
});