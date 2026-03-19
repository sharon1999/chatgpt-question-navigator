# AI Question Navigator

**AI Question Navigator** is a simple browser extension that helps you easily navigate through your long AI conversations by automatically extracting and displaying exclusively the questions you've asked. Clicking on any question in the extension popup automatically scrolls the chat window directly to that point in the conversation. It also supports exporting your conversations as a formatted PDF!

## Features

- **Multi-Platform Support:** Works seamlessly on ChatGPT, Claude, and Gemini.
- **Quick Overview:** Instantly view a list of all the prompts/questions you have asked within the current conversation.
- **Search & Filter:** Easily find specific questions using the built-in search bar in the popup.
- **Copy Prompts:** Quickly copy any of your previous prompts to reusing them.
- **Export to PDF:** Export your entire conversation (questions and AI responses) into a beautifully formatted PDF document.
- **Auto-scroll:** Click on any question in the popup list to smoothly scroll your chat tab directly to that specific message.
- **Lightweight & Fast:** Runs efficiently without slowing down your browser.

## Installation

### For Google Chrome / Microsoft Edge / Brave

1. Download or clone this repository to your local machine:
   ```bash
   git clone https://github.com/your-username/chatgpt-question-navigator.git
   ```
2. Open your browser and navigate to the Extensions management page:
   - **Chrome:** Go to `chrome://extensions/`
   - **Edge:** Go to `edge://extensions/`
   - **Brave:** Go to `brave://extensions/`
3. Enable **Developer Mode** (usually a toggle in the top right corner).
4. Click on the **Load unpacked** button.
5. Select the `chatgpt-question-navigator` folder containing the extension files (`manifest.json`, `content.js`, etc.).

The extension should now be installed and the icon will appear in your browser's toolbar.

## Usage

1. Open [ChatGPT](https://chatgpt.com), [Claude](https://claude.ai), or [Gemini](https://gemini.google.com) and navigate to any conversation.
2. Click the **AI Question Navigator** extension icon in your browser toolbar.
3. A popup will appear listing all the questions you've asked in that specific chat.
4. Use the search bar to find specific questions, or click the Export button to save the conversation as a PDF.
5. Click on any question in the list to scroll directly to it on the page.

## File Structure

- `manifest.json`: Configuration file for the browser extension.
- `content.js`: The script that reads the questions from the active AI conversation and handles the scrolling behavior.
- `popup.html` & `popup.js`: The user interface and logic for the extension's popup window.
- `export.html` & `export.js`: Handles the formatting and generation of the PDF export.
- `html2pdf.bundle.min.js`: Library used for PDF generation.

## Permissions required

- `activeTab` & `scripting`: Needed to read the text of the chat messages and execute the auto-scroll script on the page.
- `storage`: Required to temporarily store conversation data for PDF export.
- `host_permissions` (`*://chatgpt.com/*`, `*://claude.ai/*`, `*://gemini.google.com/*`): Limits the extension to only run on supported AI platforms.
