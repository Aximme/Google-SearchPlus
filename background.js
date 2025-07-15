chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.action === 'openChatGPT') {
    const query = msg.query || '';
    chrome.tabs.create({ url: 'https://chat.openai.com/' }, tab => {
      if (!tab || !tab.id) return;
      const tabId = tab.id;
      function injectScript() {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (q) => {
            const fill = () => {
              const area = document.querySelector('#prompt-textarea');
              const sendBtn = document.querySelector('#composer-submit-button');
              if (area && sendBtn) {
                area.textContent = q;
                area.dispatchEvent(new InputEvent('input', { bubbles: true }));
                sendBtn.click();
              } else {
                setTimeout(fill, 500);
              }
            };
            fill();
          },
          args: [query]
        });
      }
      chrome.tabs.onUpdated.addListener(function listener(id, info, tabInfo) {
        if (id === tabId && info.status === 'complete' &&
            tabInfo.url && /chatgpt\.com|chat\.openai\.com/.test(tabInfo.url)) {
          chrome.tabs.onUpdated.removeListener(listener);
          injectScript();
        }
      });
    });
  }
});
