// Extract main visible text from the page
function extractTextContent() {
  return document.body.innerText.slice(0, 4000); // limit to avoid API max length
}

// Send message to background to get Gemini title
chrome.runtime.sendMessage(
  { action: "generateTitle", content: extractTextContent() },
  function (response) {
    // Fallback title if none received
    const title = response?.title || "⚠️ No title received.";

    // Create Gemini sidebar box
    const box = document.createElement("div");
    box.id = "header-box";
    box.innerHTML = `
      <div class="header-box-title">Gemini TOC:</div>
      <div class="header-box-item">${title}</div>
    `;

    // Create wrapper and move all existing content into it
    const wrapper = document.createElement("div");
    wrapper.id = "content-wrapper";

    const children = Array.from(document.body.childNodes);
    children.forEach(child => {
      if (child !== box) wrapper.appendChild(child);
    });

    // Clear body and add sidebar + wrapper
    document.body.innerHTML = "";
    document.body.appendChild(box);
    document.body.appendChild(wrapper);
  }
);