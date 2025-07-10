# PagePilot 🚀 – AI-Powered Table of Contents for the Web

PagePilot is a Chrome extension that makes long-form webpages (blog posts, documentation, news articles, etc.) easier to read and navigate.  
Using generative-AI, it analyses the structure of the page in real-time and injects an interactive, clickable Table of Contents (ToC) plus a reading-progress indicator.

<p float="left">
  <img
    src="https://lh7-rt.googleusercontent.com/slidesz/AGV_vUdiUkXYMw696FM_DZ_dBuJ5Z-Pbd2KPpGuon8j2i1Q0vxhefpzWAonrFApp3TuShMkmS5ju28dcmOsXB96xzQ0ylIdnAkQBB3muj5BzzDGR1CCzkVWlrBbjAO-c3MjEn_b_TH0d5A=s2048?key=OgsOfLXvIjA6ykBXm2OgYw"
    width="45%" 
    style="margin-right:5%;" 
    alt="PagePilot screenshot 1"
  />
  <img
    src="https://lh7-rt.googleusercontent.com/slidesz/AGV_vUeUrR6bbYsN3icKgaoeHjG7eDL58oervEngz6Co1fKLFjaHSjafKanSq-tpdvdF5wWV3dw7kaKPsA6cFIjn_yP8yGEg3tEJ551G7XgvBl9RAbEYI6dL0NC-Lhuf1FcTp4Zk3fnCUA=s2048?key=OgsOfLXvIjA6ykBXm2OgYw"
    width="45%" 
    alt="PagePilot screenshot 2"
  />
</p>

---

## ✨ Key Features

* **Automatic Table of Contents** – Gemini AI inspects headings and the surrounding context to build a clean outline of the page.  
* **Clickable Sections** – Jump to any heading instantly; the current section is highlighted as you scroll.
* **Reading Progress Bar** – A slim bar at the top of the window shows how far you’ve read at a glance.
* **Non-intrusive UI** – The ToC lives in a collapsible sidebar that respects the site’s own design.

### Next Steps ⏳
1. Adjustable fonts & colour themes for better accessibility.  
2. Section-specific bookmarks.  
3. Speed-adjustable text-to-speech.  
4. Auto-highlight of key ideas for skimming.

---

## 🗂️ How It Works (High-level)

1. **`content.js`** is injected into every page (declared in `manifest.json`).  
2. When you click the extension icon, `content.js` asks Gemini (Google AI) to analyse the DOM and identify headings.  
3. The script builds a structured list and renders the ToC sidebar & progress bar with vanilla JS + CSS.  
4. Smooth-scroll listeners keep the ToC in sync with the reader’s position.

For background tasks (future caching, settings sync, etc.) we use **`background.js`** as a Manifest V3 service-worker.

> No external servers – everything runs locally in the browser, keeping your reading private.

---

## 🛠️ Installation (Developer Mode)

1. **Clone or download** this repository.  
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** using the toggle in the top-right corner.  
4. Click **Load unpacked** (top-left) and select the project folder (the one containing `manifest.json`).  
5. PagePilot now appears in your extension list (Make sure to Pin it).

---

## 🚀 Usage

1. Visit any article or documentation page.  
2. Click the **PagePilot icon** in the toolbar (next to the address bar) to activate it on the current tab.  
3. A sidebar with the auto-generated Table of Contents slides in.  
4. Click items to jump, scroll to see progress.

That’s it – happy reading!

---

