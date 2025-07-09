// Extract main visible text from the page
function extractTextContent() {
  return document.body.innerText.slice(0, 16000); // limit to avoid API max length
}

// Send message to background to get Gemini ToC
chrome.runtime.sendMessage(
  { action: "generateToC", content: extractTextContent() },
  function (response) {
    // Fallback ToC if none received
    const toc = response?.toc || "No ToC received.";

    // Create Gemini sidebar box
    const box = document.createElement("div");
    box.id = "header-box";
    box.innerHTML = `
      <div class="header-box-title">Gemini TOC:</div>
      <div class="header-box-item">${toc}</div>
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