// Store references if we need them, but querying DOM on demand is usually safer in a dynamic SPA
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_questions") {
    // ChatGPT usually assigns 'data-message-author-role="user"' to user messages
    const userNodes = document.querySelectorAll(
      '[data-message-author-role="user"]',
    );

    const questions = Array.from(userNodes).map((node, index) => {
      // Mark node with our index so we can retrieve it exactly later
      node.setAttribute("data-navigator-index", index);

      // Extract text, usually the text is inside nested divs.
      // We can just use textContent or innerText.
      // We will truncate it slightly in the popup, but here we can send it all or a chunk.
      let text =
        node.innerText || node.textContent || "Image / non-text message";
      text = text.trim();
      if (!text) text = "Empty message";

      return {
        index: index,
        text: text,
      };
    });

    sendResponse({ questions });
  } else if (request.action === "scroll_to") {
    const targetNode = document.querySelector(
      `[data-message-author-role="user"][data-navigator-index="${request.index}"]`,
    );
    if (targetNode) {
      // Smooth scroll into view
      targetNode.scrollIntoView({ behavior: "smooth", block: "center" });

      // Optional: highlight visually briefly
      const originalBg = targetNode.style.backgroundColor;
      const originalTransition = targetNode.style.transition;

      targetNode.style.transition = "background-color 0.5s ease";
      targetNode.style.backgroundColor = "rgba(16, 163, 127, 0.2)"; // ChatGPT green tint

      setTimeout(() => {
        targetNode.style.backgroundColor = originalBg;
        setTimeout(() => {
          targetNode.style.transition = originalTransition;
        }, 500);
      }, 1500);

      sendResponse({ success: true });
    } else {
      sendResponse({ success: false, error: "Node not found." });
    }
  }

  // Return true if we want to sendResponse asynchronously
  // In this case everything is synchronous, so returning true is safe but optional.
});
