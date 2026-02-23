document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("empty-state");
  const questionList = document.getElementById("question-list");

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url.includes("chatgpt.com")) {
    loading.style.display = "none";
    emptyState.textContent =
      "Please open a ChatGPT conversation to use this extension.";
    emptyState.style.display = "block";
    return;
  }

  // Inject content script if not already present, just in case
  // But our manifest says it runs automatically. Still, we can send a message.
  chrome.tabs.sendMessage(tab.id, { action: "get_questions" }, (response) => {
    loading.style.display = "none";

    // If an error occurred or no response
    if (chrome.runtime.lastError || !response) {
      emptyState.textContent =
        "Could not communicate with the page. Try refreshing the tab.";
      emptyState.style.display = "block";
      return;
    }

    const { questions } = response;

    if (!questions || questions.length === 0) {
      emptyState.style.display = "block";
      return;
    }

    // Render questions
    questions.forEach((q, i) => {
      const item = document.createElement("div");
      item.className = "question-item";

      const badge = document.createElement("div");
      badge.className = "index-badge";
      badge.textContent = `#${i + 1}`;

      const text = document.createElement("div");
      text.className = "question-text";
      text.textContent = q.text;

      item.appendChild(badge);
      item.appendChild(text);

      item.addEventListener("click", () => {
        chrome.tabs.sendMessage(tab.id, {
          action: "scroll_to",
          index: q.index,
        });
      });

      questionList.appendChild(item);
    });
  });
});
