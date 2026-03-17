document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['exportData'], (result) => {
        const allQuestions = result.exportData;
        if (!allQuestions || allQuestions.length === 0) {
            document.getElementById('loading').innerHTML = '<h2>No data found to export.</h2>';
            return;
        }

        // Create the container 
        const container = document.createElement("div");
        container.id = "render-container";
        container.style.padding = "40px";
        container.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
        container.style.color = "#333";
        container.style.backgroundColor = "#fafafa";
        
        // Add a gorgeous header
        const header = document.createElement("div");
        header.style.textAlign = "center";
        header.style.marginBottom = "40px";
        header.style.borderBottom = "2px solid #eaeaea";
        header.style.paddingBottom = "20px";
        
        const title = document.createElement("h1");
        title.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px; margin-bottom: 4px;"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#10a37f"/><path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>AI Conversation Export`;
        title.style.margin = "0 0 10px 0";
        title.style.color = "#10a37f";
        title.style.fontSize = "28px";
        
        const subtitle = document.createElement("p");
        subtitle.textContent = `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`;
        subtitle.style.margin = "0";
        subtitle.style.color = "#888";
        subtitle.style.fontSize = "14px";
        
        header.appendChild(title);
        header.appendChild(subtitle);
        container.appendChild(header);

        // Add questions and responses as chat bubbles
        const chatContainer = document.createElement("div");
        chatContainer.style.display = "flex";
        chatContainer.style.flexDirection = "column";
        chatContainer.style.gap = "24px";

        allQuestions.forEach((q, i) => {
          const qContainer = document.createElement("div");
          qContainer.style.display = "flex";
          qContainer.style.flexDirection = "column";
          qContainer.style.gap = "12px";
          qContainer.style.marginBottom = "10px";

          // User Bubble 
          const userRow = document.createElement("div");
          userRow.style.display = "flex";
          userRow.style.justifyContent = "flex-end";
          userRow.style.marginBottom = "8px";

          const userBubble = document.createElement("div");
          userBubble.style.backgroundColor = "#f3f4f6"; 
          userBubble.style.padding = "16px 20px";
          userBubble.style.borderRadius = "18px 18px 4px 18px";
          userBubble.style.maxWidth = "85%";
          userBubble.style.boxShadow = "0 1px 2px rgba(0,0,0,0.05)";
          
          const userLabel = document.createElement("div");
          userLabel.textContent = `Question #${q.index + 1}`;
          userLabel.style.fontSize = "12px";
          userLabel.style.fontWeight = "bold";
          userLabel.style.color = "#6b7280";
          userLabel.style.marginBottom = "6px";
          
          const userText = document.createElement("div");
          userText.textContent = q.text;
          userText.style.fontSize = "15px";
          userText.style.lineHeight = "1.6";
          userText.style.whiteSpace = "pre-wrap";
          userText.style.wordBreak = "break-word";

          userBubble.appendChild(userLabel);
          userBubble.appendChild(userText);
          userRow.appendChild(userBubble);
          qContainer.appendChild(userRow);

          // AI Response Bubble
          if (q.response) {
            const aiRow = document.createElement("div");
            aiRow.style.display = "flex";
            aiRow.style.justifyContent = "flex-start";
            
            const aiBubble = document.createElement("div");
            aiBubble.style.backgroundColor = "#ffffff";
            aiBubble.style.border = "1px solid #e5e7eb";
            aiBubble.style.padding = "16px 20px";
            aiBubble.style.borderRadius = "18px 18px 18px 4px";
            aiBubble.style.maxWidth = "90%";
            aiBubble.style.boxShadow = "0 2px 4px rgba(0,0,0,0.02)";
            
            const aiLabel = document.createElement("div");
            aiLabel.style.fontSize = "12px";
            aiLabel.style.fontWeight = "bold";
            aiLabel.style.color = "#10a37f";
            aiLabel.style.marginBottom = "8px";
            aiLabel.style.display = "flex";
            aiLabel.style.alignItems = "center";
            aiLabel.style.gap = "6px";
            
            // Replaced inline SVG with emojis to prevent html2canvas SVG rendering issues
            aiLabel.innerHTML = `🤖 AI Assistant`;
            
            const aiText = document.createElement("div");
            aiText.textContent = q.response;
            aiText.style.fontSize = "15px";
            aiText.style.lineHeight = "1.6";
            aiText.style.whiteSpace = "pre-wrap";
            aiText.style.wordBreak = "break-word";
            aiText.style.color = "#374151";

            aiBubble.appendChild(aiLabel);
            aiBubble.appendChild(aiText);
            aiRow.appendChild(aiBubble);
            qContainer.appendChild(aiRow);
          }

          chatContainer.appendChild(qContainer);
        });

        container.appendChild(chatContainer);

        // Add a footer
        const footer = document.createElement("div");
        footer.style.marginTop = "40px";
        footer.style.paddingTop = "20px";
        footer.style.borderTop = "1px solid #eaeaea";
        footer.style.textAlign = "center";
        footer.style.color = "#9ca3af";
        footer.style.fontSize = "12px";
        footer.textContent = "Exported using AI Question Navigator.";
        container.appendChild(footer);

        document.getElementById('loading').style.display = 'none';
        document.body.appendChild(container);

        // Allow 500ms for browser layout engine to paint DOM so html2canvas avoids blank/clipped renders
        setTimeout(() => {
            const opt = {
                margin: [10, 0, 10, 0],
                filename: 'conversation_export.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2, 
                    useCORS: true, 
                    logging: true // Enabled logging so we could inspect in DevTools if it fails again
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().set(opt).from(container).save().then(() => {
                document.getElementById('loading').style.display = 'block';
                document.getElementById('loading').innerHTML = `
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom:16px;">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#10a37f"/>
                        <path d="M8 12L11 15L16 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2>Done!</h2>
                    <p>Your beautiful PDF has been exported. You can close this tab.</p>
                `;
                container.style.display = 'none';
                
                // Clear storage so we don't hold onto large strings
                chrome.storage.local.remove(['exportData']);
            }).catch(err => {
                console.error("PDF generation failed", err);
                document.getElementById('loading').style.display = 'block';
                document.getElementById('loading').innerHTML = '<h2>Failed to generate PDF.</h2>';
                container.style.display = 'none';
            });
        }, 500);
    });
});
