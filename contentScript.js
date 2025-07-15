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

function insertMapsTab() {
  chrome.storage.local.get({ mapsEnabled: true }, data => {
    if (!data.mapsEnabled) return;
    createTab('maps-tab', 'Maps', () => {
      const query = document.querySelector('input[name="q"]').value || '';
      window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    }, true);
  });
}

function insertOrthoTab() {
  chrome.storage.local.get({ orthoEnabled: true }, data => {
    if (!data.orthoEnabled) return;
    createTab('ortho-tab', 'Orthographe', () => {
      const query = document.querySelector('input[name="q"]').value || '';
      window.location.href = `https://www.reverso.net/orthographe/correcteur-francais/#text=${encodeURIComponent(query)}`;
    });
  });
}

function insertTrendsTab() {
  chrome.storage.local.get({ trendsEnabled: true }, data => {
    if (!data.trendsEnabled) return;
    createTab('trends-tab', 'Tendances', () => {
      const query = document.querySelector('input[name="q"]').value || '';
      window.location.href = `https://trends.google.fr/trends/explore?geo=FR&q=${encodeURIComponent(query)}`;
    });
  });
}

function insertAllTabs() {
  insertMapsTab();
  insertOrthoTab();
  insertTrendsTab();
}

const observer = new MutationObserver(insertAllTabs);
observer.observe(document.body, { childList: true, subtree: true });

insertAllTabs();
