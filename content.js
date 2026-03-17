// Configuration for different AI platforms
const PLATFORM_CONFIG = {
  chatgpt: {
    hostname: "chatgpt",
    userSelector: '[data-message-author-role="user"]',
    aiSelector: '[data-message-author-role="assistant"]',
  },
  claude: {
    hostname: "claude",
    userSelector: '.font-user-message, [data-is-user="true"], [data-testid="user-message"]',
    aiSelector: '.font-claude-message, [data-is-user="false"]',
  },
  gemini: {
    hostname: "gemini",
    userSelector: "user-query",
    aiSelector: "model-response",
  },
};

function getActivePlatformConfig() {
  const hostname = window.location.hostname;
  for (const key in PLATFORM_CONFIG) {
    if (hostname.includes(PLATFORM_CONFIG[key].hostname)) {
      return PLATFORM_CONFIG[key];
    }
  }
  return PLATFORM_CONFIG.chatgpt; // Default fallback
}

// Store references if we need them, but querying DOM on demand is usually safer in a dynamic SPA
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "get_questions") {
    const platform = getActivePlatformConfig();
    
    // Select both user and AI nodes in DOM order
    const selectors = `${platform.userSelector}, ${platform.aiSelector}`;
    const allNodes = document.querySelectorAll(selectors);

    const questions = [];
    let currentQuestionIndex = 0;

    Array.from(allNodes).forEach((node) => {
      // Determine if this is a user node
      const isUserNode = node.matches(platform.userSelector);

      if (isUserNode) {
        // Mark node with our index so we can retrieve it exactly later
        node.setAttribute("data-navigator-index", currentQuestionIndex);

        let text = node.innerText || node.textContent || "Image / non-text message";
        text = text.trim();
        if (!text) text = "Empty message";

        questions.push({
          index: currentQuestionIndex,
          text: text,
          response: "", // Will be filled by subsequent AI nodes
        });
        
        currentQuestionIndex++;
      } else {
        // It's an AI node. Append its text to the *last* user question
        if (questions.length > 0) {
          let aiText = node.innerText || node.textContent || "[Non-text AI response]";
          aiText = aiText.trim();
          
          const lastIndex = questions.length - 1;
          
          if (questions[lastIndex].response) {
             questions[lastIndex].response += "\n\n" + aiText;
          } else {
             questions[lastIndex].response = aiText;
          }
        }
      }
    });

    sendResponse({ questions });
  } else if (request.action === "scroll_to") {
    const platform = getActivePlatformConfig();
    
    // We can't always just query by data-navigator-index globally if the selector also matters, 
    // but data-navigator-index should be unique enough. For safety, we combine them.
    const targetNode = document.querySelector(
      `${platform.userSelector}[data-navigator-index="${request.index}"]`,
    );
    if (targetNode) {
      // Smooth scroll into view
      targetNode.scrollIntoView({ behavior: "smooth", block: "center" });

      // Optional: highlight visually briefly
      const originalBg = targetNode.style.backgroundColor;
      const originalTransition = targetNode.style.transition;

      targetNode.style.transition = "background-color 0.5s ease";
      
      // Determine highlight color based on platform
      let highlightColor = "rgba(16, 163, 127, 0.2)"; // ChatGPT green
      if (platform.hostname === "claude") {
         highlightColor = "rgba(217, 119, 87, 0.2)"; // Claude orange
      } else if (platform.hostname === "gemini") {
         highlightColor = "rgba(26, 115, 232, 0.2)"; // Gemini blue
      }
      
      targetNode.style.backgroundColor = highlightColor;

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
