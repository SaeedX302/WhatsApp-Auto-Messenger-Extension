document.addEventListener('DOMContentLoaded', function () {
  // Button 1 Event (Old Function)
  document.getElementById("sendBtn1").addEventListener("click", () => {
    const msg = document.getElementById("msgBox").value.trim();

    if (!msg) return alert("Message likh pehle!");

    const msgs = [msg].join("\\n");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: enviarScript,
        args: [msgs]
      });
    });
  });

  // Button 2 Event (New Function with Message Count)
  document.getElementById("sendBtn2").addEventListener("click", () => {
    const msg = document.getElementById("msgBox2").value.trim();
    const count = parseInt(document.getElementById("msgCount").value);

    if (!msg) return alert("Message likh pehle!");
    if (!count || count < 1) return alert("Valid number daal chutiyapa ke liye!");

    const msgs = Array(count).fill(msg).join("\n");

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: enviarScript,
        args: [msgs]
      });
    });
  });

  // Tab switching logic
  document.getElementById("tab1Btn").addEventListener("click", () => {
    document.getElementById("tab1").classList.add("active");
    document.getElementById("tab2").classList.remove("active");
    document.getElementById("tab1Btn").classList.add("active");
    document.getElementById("tab2Btn").classList.remove("active");
  });

  document.getElementById("tab2Btn").addEventListener("click", () => {
    document.getElementById("tab2").classList.add("active");
    document.getElementById("tab1").classList.remove("active");
    document.getElementById("tab2Btn").classList.add("active");
    document.getElementById("tab1Btn").classList.remove("active");
  });
});

function enviarScript(scriptText) {
  const lines = scriptText.split(/[\n\\t]+/).map(line => line.trim()).filter(line => line);
  const main = document.querySelector("#main");
  const textarea = main?.querySelector(`div[contenteditable="true"]`);

  if (!textarea) return alert("Koi WhatsApp chat khol pehle!");

  (async () => {
    for (const [i, line] of lines.entries()) {
      const sel = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(textarea);
      range.collapse(false);
      sel.removeAllRanges();
      sel.addRange(range);

      document.execCommand("insertText", false, line);
      textarea.dispatchEvent(new InputEvent("input", { bubbles: true }));

      await new Promise(r => setTimeout(r, 200)); // ultra fast

      const btn = main.querySelector(`[data-testid="send"]`) || main.querySelector(`[data-icon="send"]`);
      btn?.click();

      if (i < lines.length - 1) await new Promise(r => setTimeout(r, 250));
    }
  })();
}

