document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const emptyState = document.getElementById("empty-state");
  const questionList = document.getElementById("question-list");

  const searchInput = document.getElementById("search-input");
  const exportBtn = document.getElementById("export-btn");
  let allQuestions = [];

  // Get active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (
    !tab ||
    !(
      tab.url.includes("chatgpt.com") ||
      tab.url.includes("claude.ai") ||
      tab.url.includes("gemini.google.com")
    )
  ) {
    loading.style.display = "none";
    emptyState.textContent =
      "Please open ChatGPT, Claude, or Gemini to use this extension.";
    emptyState.style.display = "block";
    if (searchInput) searchInput.disabled = true;
    if (exportBtn) exportBtn.disabled = true;
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
      if (searchInput) searchInput.disabled = true;
      if (exportBtn) exportBtn.disabled = true;
      return;
    }

    const { questions } = response;
    allQuestions = questions || [];

    if (!allQuestions || allQuestions.length === 0) {
      emptyState.style.display = "block";
      if (searchInput) searchInput.disabled = true;
      if (exportBtn) exportBtn.disabled = true;
      return;
    }

    // Render questions function for reusability (search filtering)
    function renderQuestions(items) {
      questionList.innerHTML = "";

      if (items.length === 0) {
        // Show empty state specifically for search empty results
        const searchEmpty = document.createElement("div");
        searchEmpty.className = "empty-state";
        searchEmpty.style.paddingTop = "16px";
        searchEmpty.textContent = "No questions match your search.";
        questionList.appendChild(searchEmpty);
        return;
      }

      items.forEach((q) => {
        const item = document.createElement("div");
        item.className = "question-item";

        const badge = document.createElement("div");
        badge.className = "index-badge";
        // Use q.index + 1 to keep original numbering regardless of filter
        badge.textContent = `#${q.index + 1}`;

        const text = document.createElement("div");
        text.className = "question-text";
        text.textContent = q.text;

        // Copy button
        const copyBtn = document.createElement("button");
        copyBtn.className = "copy-btn";
        copyBtn.title = "Copy prompt";
        copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

        copyBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // Prevent triggering the row click
          navigator.clipboard.writeText(q.text).then(() => {
            const originalIcon = copyBtn.innerHTML;
            copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10a37f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            setTimeout(() => {
              copyBtn.innerHTML = originalIcon;
            }, 1500);
          });
        });

        item.appendChild(badge);
        item.appendChild(text);
        item.appendChild(copyBtn);

        item.addEventListener("click", () => {
          chrome.tabs.sendMessage(tab.id, {
            action: "scroll_to",
            index: q.index,
          });
        });

        questionList.appendChild(item);
      });
    }

    // Initial render
    renderQuestions(allQuestions);

    // Set up search listener
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          renderQuestions(allQuestions);
        } else {
          const filtered = allQuestions.filter((q) =>
            q.text.toLowerCase().includes(query),
          );
          renderQuestions(filtered);
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        // Change button state to loading
        const originalIcon = exportBtn.innerHTML;
        exportBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>`;
        exportBtn.disabled = true;

        chrome.storage.local.set({ exportData: allQuestions }, () => {
          chrome.tabs.create({ url: chrome.runtime.getURL("export.html") });
          exportBtn.innerHTML = originalIcon;
          exportBtn.disabled = false;
        });
      });
    }
  });
});
