# ChatGPT Question Navigator

**ChatGPT Question Navigator** is a simple browser extension that helps you easily navigate through your long ChatGPT conversations by automatically extracting and displaying exclusively the questions you've asked. Clicking on any question in the extension popup automatically scrolls the chat window directly to that point in the conversation.

## Features

- **Quick Overview:** Instantly view a list of all the prompts/questions you have asked within the current ChatGPT chat.
- **Auto-scroll:** Click on any question in the popup list to smoothly scroll your ChatGPT tab directly to that specific message.
- **Lightweight & Fast:** Runs efficiently on `chatgpt.com` without slowing down your browser.

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

1. Open [ChatGPT](https://chatgpt.com) and navigate to any conversation.
2. Click the **ChatGPT Question Navigator** extension icon in your browser toolbar.
3. A popup will appear listing all the questions you've asked in that specific chat.
4. Click on any question in the list to scroll directly to it on the page.

## File Structure

- `manifest.json`: Configuration file for the browser extension.
- `content.js`: The script that reads the questions from the active ChatGPT conversation and handles the scrolling behavior.
- `popup.html` & `popup.js`: The user interface and logic for the extension's popup window.

## Permissions required

- `activeTab` & `scripting`: Needed to read the text of the chat messages and execute the auto-scroll script on the page.
- `host_permissions` (`*://chatgpt.com/*`): Limits the extension to only run on ChatGPT.
