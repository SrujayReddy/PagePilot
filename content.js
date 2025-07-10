// Step 1: Extract visible blocks
function getVisibleTextBlocks() {
  const blocks = [];
  const container = document.querySelector("main, article") || document.body;
  const elements = container.querySelectorAll("p, div, span");

  elements.forEach(el => {
    const text = el.innerText?.trim();
    if (
      text &&
      text.length > 10 &&
      text.length < 150 &&
      el.offsetParent !== null &&
      getComputedStyle(el).display !== "none"
    ) {
      blocks.push({ text, node: el });
    }
  });

  return blocks;
}

const textBlocks = getVisibleTextBlocks().filter(b =>
  !/cookie|privacy|login|menu|site navigation/i.test(b.text)
);
const allText = textBlocks.map(b => b.text).join("\n\n");

chrome.runtime.sendMessage({ action: "findHeaders", content: allText }, function (response) {
  const headers = response?.headers || [];
  console.log("🧭 Gemini TOC headers:", headers);

  // Build sidebar TOC
  const tocBox = document.createElement("div");
  tocBox.id = "toc-box";
  tocBox.innerHTML = `<div class="toc-title">Table of Contents</div>`;
  const list = document.createElement("ul");

  // Style and inject sidebar without re-writing the whole body to avoid CSP issues
const sidebarWidth = 260;
  tocBox.style.position = "fixed";
  tocBox.style.top = "0";
tocBox.style.left = "0";
  tocBox.style.width = sidebarWidth + "px";
  tocBox.style.height = "100vh";
  tocBox.style.overflowY = "auto";
tocBox.style.background = "#ffffff";
  tocBox.style.borderLeft = "1px solid #e5e5e5";
  tocBox.style.padding = "1rem";
  tocBox.style.zIndex = "9999";

  // Give the main page a right-hand margin so content isn't hidden under the sidebar
const currentMarginLeft = parseFloat(getComputedStyle(document.body).marginLeft) || 0;
  document.body.style.marginLeft = currentMarginLeft + sidebarWidth + 20 + "px";

  // Basic styles for list + highlight
  const styleEl = document.createElement("style");
  styleEl.textContent = `
    #toc-box .toc-title { font-weight: 600; margin-bottom: 0.5rem; font-family: sans-serif; }
    #toc-box ul { list-style: none; padding: 0; margin: 0; }
    #toc-box .toc-item { cursor: pointer; color: #0366d6; margin: 0.25rem 0; font-family: sans-serif; }
    #toc-box .toc-item:hover { text-decoration: underline; }
    .gemini-header-highlight { background: #ffff99; transition: background 0.3s ease; }
    #scroll-progress {position: fixed; top:0; left:0; height:4px; background:#4caf50; width:0%; z-index:10000;}
    body {font-family: "Georgia", "Times New Roman", serif; line-height:1.6; color:#111; background:#fbfbfb;}
    mark.pagepilot-highlight{background-color:#fffb8f; font-weight:bold;}
  `;
document.head.appendChild(styleEl);

  // Finally add the sidebar to the page
  document.body.appendChild(tocBox);

  headers.forEach(headerText => {
  let bestMatch = null;
  let bestScore = -Infinity;

textBlocks.forEach(block => {
    const blockText = block.text.toLowerCase().trim();

    // Simple keyword highlighting for important phrases
    const highlightKeywords = ["important", "note", "warning", "key idea", "summary"];
    highlightKeywords.forEach(k=> {
      const re = new RegExp(`\\b${k}\\b`, "i");
      if(re.test(blockText)) {
        block.node.innerHTML = block.node.innerHTML.replace(re, `<mark class="pagepilot-highlight">$&</mark>`);
      }
    });
    const header = headerText.toLowerCase().trim();

    let score = 0;

    if (blockText === header) {
      score += 100; // perfect match
    } else if (blockText.startsWith(header)) {
      score += 50;
    } else if (blockText.includes(header)) {
      score += 20;
    }

    // Prefer shorter blocks (more likely to be headers)
    score -= blockText.length / 100;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = block;
    }
  });

  if (bestMatch) {
    const id = "header-" + Math.random().toString(36).slice(2, 10);
    bestMatch.node.setAttribute("data-header-id", id);

    const li = document.createElement("li");
    li.className = "toc-item";
    li.textContent = headerText;
    li.addEventListener("click", () => {
      bestMatch.node.scrollIntoView({ behavior: "smooth", block: "center" });
      bestMatch.node.classList.add("gemini-header-highlight");
      setTimeout(() => {
        bestMatch.node.classList.remove("gemini-header-highlight");
      }, 2000);
    });

    list.appendChild(li);
  }
  });

tocBox.appendChild(list);

// Scroll progress bar
const progress = document.createElement("div");
progress.id = "scroll-progress";
document.body.appendChild(progress);
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrolled = (scrollTop / docHeight) * 100;
  progress.style.width = scrolled + "%";
}
window.addEventListener("scroll", updateProgress);
updateProgress();
});

