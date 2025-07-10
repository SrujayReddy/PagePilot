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

  // Step 1: Wrap original page content to shift it
  const wrapper = document.createElement("div");
  wrapper.id = "content-wrapper";

  const children = Array.from(document.body.childNodes);
  children.forEach(child => {
    if (child !== tocBox) wrapper.appendChild(child);
  });

  // Clear body and re-add everything
  document.body.innerHTML = "";
  document.body.appendChild(tocBox);
  document.body.appendChild(wrapper);

  headers.forEach(headerText => {
  let bestMatch = null;
  let bestScore = -Infinity;

  textBlocks.forEach(block => {
    const blockText = block.text.toLowerCase().trim();
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
  document.body.appendChild(tocBox);
});