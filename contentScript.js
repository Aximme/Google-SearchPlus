function createTab(id, labelText, onClick, insertBeforeImages = false) {
  const listContainer = document.querySelector('div[role="list"][style*="display:contents"]');
  if (!listContainer || document.getElementById(id)) return;
  const items = Array.from(listContainer.children);

  const imagesItem = items.find(item => {
    const a = item.querySelector('a');
    return a && /Images/i.test(a.textContent);
  });
  if (!imagesItem) return;

  const newItem = imagesItem.cloneNode(true);
  newItem.id = id;

  const a = newItem.querySelector('a');
  a.removeAttribute('href');
  a.addEventListener('click', e => {
    e.preventDefault();
    onClick();
  });

  const label = newItem.querySelector('div.YmvwI');
  if (label) label.textContent = labelText;

  if (insertBeforeImages) {
    listContainer.insertBefore(newItem, imagesItem);
  } else {
    listContainer.appendChild(newItem);
  }
}

function getQuery() {
  const homeInput = document.querySelector('input#input.truncate');
  if (homeInput) return homeInput.value || '';
  const searchInput = document.querySelector('textarea#gLFyf, textarea#APjFqb, input[name="q"]');
  return searchInput ? searchInput.value || '' : '';
}

function insertMapsTab() {
  createTab('maps-tab', 'Maps', () => {
    const query = getQuery();
    window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
  }, true);
}

function insertOrthoTab() {
  createTab('ortho-tab', 'Orthographe', () => {
    const query = getQuery();
    window.location.href = `https://www.reverso.net/orthographe/correcteur-francais/#text=${encodeURIComponent(query)}`;
  });
}

function insertTrendsTab() {
  createTab('trends-tab', 'Tendances', () => {
    const query = getQuery();
    window.location.href = `https://trends.google.fr/trends/explore?geo=FR&q=${encodeURIComponent(query)}`;
  });
}

function insertChatgptButton() {
  const voiceBtn = document.querySelector('#voiceSearchButton, div[aria-label="Utiliser la recherche vocale"]');
  if (!voiceBtn || document.getElementById('chatgptButton')) return;

  const chatBtn = voiceBtn.cloneNode(true);
  chatBtn.id = 'chatgptButton';
  chatBtn.title = 'Envoyer à ChatGPT';
  chatBtn.innerHTML = '';
  const img = document.createElement('img');
  img.src = chrome.runtime.getURL('icons/chatgpt.png');
  img.style.width = '24px';
  img.style.height = '24px';
  chatBtn.appendChild(img);
  chatBtn.addEventListener('click', e => {
    e.preventDefault();
    const query = getQuery();
    chrome.runtime.sendMessage({ action: 'openChatGPT', query });
  });

  voiceBtn.parentNode.insertBefore(chatBtn, voiceBtn);
}

function insertAllTabs() {
  insertMapsTab();
  insertOrthoTab();
  insertTrendsTab();
  insertChatgptButton();
}

const observer = new MutationObserver(insertAllTabs);
observer.observe(document.body, { childList: true, subtree: true });

insertAllTabs();
