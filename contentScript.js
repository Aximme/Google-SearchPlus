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

function insertFilterButton() {
  const clearBtn = document.querySelector('span[jsname="itVqKe"].ExCKkf.z1asCe.rzyADb, div[jsname="pkjasb"]');
  if (!clearBtn || document.getElementById('filterButton')) return;

  const filterBtn = document.createElement('div');
  filterBtn.id = 'filterButton';
  filterBtn.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 12px;
    margin-right: 8px;
    background: transparent !important;
    border: none;
    cursor: pointer;
    font-size: 14px;
    color: #a8a7a7ff;
    position: relative;
    user-select: none;
    transition: none !important;
  `;
  filterBtn.textContent = 'Filtres';
  filterBtn.title = 'Opérateurs de recherche Google';

  filterBtn.addEventListener('mouseenter', (e) => {
    e.target.style.background = 'transparent !important';
    e.target.style.backgroundColor = 'transparent !important';
  });
  filterBtn.addEventListener('mouseleave', (e) => {
    e.target.style.background = 'transparent !important';
    e.target.style.backgroundColor = 'transparent !important';
  });

  const menu = document.createElement('div');
  menu.id = 'filterMenu';
  menu.style.cssText = `
    position: absolute;
    top: 100%;
    left: 0;
    background: white;
    border: 1px solid #dadce0;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    min-width: 320px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    display: none;
    margin-top: 4px;
  `;

  if (document.documentElement.getAttribute('data-dark') === 'true') {
    menu.style.background = '#303134';
    menu.style.borderColor = '#5f6368';
    menu.style.color = '#e8eaed';
  }

  const searchOperators = [
    { 
      emoji: '🔍', 
      title: 'Recherche exacte', 
      description: 'Chercher exactement une succession de termes.', 
      usage: '"expression exacte"',
      example: '"intelligence artificielle"'
    },
    { 
      emoji: '🗂️', 
      title: 'Type de fichier', 
      description: 'Chercher un type de fichier précis.', 
      usage: 'filetype:',
      example: 'filetype:pdf'
    },
    { 
      emoji: '🎯', 
      title: 'Dans le titre', 
      description: 'Chercher des pages avec un mot dans le titre.', 
      usage: 'intitle:mot',
      example: 'intitle:tutorial'
    },
    { 
      emoji: '🔗', 
      title: 'Dans l\'URL', 
      description: 'Chercher des pages avec un mot dans l\'URL.', 
      usage: 'inurl:mot',
      example: 'inurl:github'
    },
    { 
      emoji: '📝', 
      title: 'Dans le texte', 
      description: 'Chercher des pages avec un mot dans le corps du texte.', 
      usage: 'intext:mot',
      example: 'intext:javascript'
    },
    { 
      emoji: '🪢', 
      title: 'Exclure des mots', 
      description: 'Exclure certains mots des résultats.', 
      usage: 'recherche -motàexclure',
      example: 'python -snake'
    },
    { 
      emoji: '📌', 
      title: 'Limiter à un site spécifique', 
      description: 'Chercher des résultats uniquement sur un site donné.', 
      usage: 'site:nomdusite.com',
      example: 'site:github.com'
    },
    { 
      emoji: '🧩', 
      title: 'Rechercher avec un ou plusieurs mots (OU logique)', 
      description: 'Inclure plusieurs mots-clés alternatifs.', 
      usage: 'mot1 OR mot2',
      example: 'javascript OR typescript'
    },
    { 
      emoji: '📅', 
      title: 'Recherche par date (plage temporelle)', 
      description: 'Limiter les résultats à une période spécifique.', 
      usage: 'after:YYYY-MM-DD before:YYYY-MM-DD',
      example: 'after:2023-01-01 before:2023-12-31'
    },
    { 
      emoji: '🌐', 
      title: 'Limiter à un domaine de site (générique)', 
      description: 'Rechercher uniquement sur des domaines spécifiques (.fr, .edu, etc).', 
      usage: 'site:.fr',
      example: 'site:.edu'
    },
    { 
      emoji: '📚', 
      title: 'Définir un mot ou une expression', 
      description: 'Afficher directement la définition.', 
      usage: 'define:mot',
      example: 'define:algorithm'
    },
    { 
      emoji: '🌀', 
      title: 'Remplir les blancs (joker)', 
      description: 'Chercher une expression avec un ou plusieurs mots manquants.', 
      usage: '"terme * terme"',
      example: '"the * of artificial intelligence"'
    },
    { 
      emoji: '🧠', 
      title: 'Recherche associée (synonymes)', 
      description: 'Chercher des synonymes ou variantes proches.', 
      usage: '~mot',
      example: '~car'
    }
  ];

  searchOperators.forEach(operator => {
    const item = document.createElement('div');
    item.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    `;

    if (document.documentElement.getAttribute('data-dark') === 'true') {
      item.style.borderBottomColor = '#5f6368';
    }

    item.innerHTML = `
      <span style="font-size: 16px; flex-shrink: 0;">${operator.emoji}</span>
      <div style="flex: 1;">
        <div style="font-weight: 500; color: ${document.documentElement.getAttribute('data-dark') === 'true' ? '#e8eaed' : '#202124'}; margin-bottom: 4px;">
          ${operator.title}
        </div>
        <div style="font-size: 12px; color: ${document.documentElement.getAttribute('data-dark') === 'true' ? '#9aa0a6' : '#5f6368'}; line-height: 1.4;">
          ${operator.description}
        </div>
      </div>
    `;

    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const searchInput = document.querySelector('textarea#gLFyf, textarea#APjFqb, input[name="q"], input#input.truncate');
      if (searchInput) {
        const currentValue = searchInput.value;
        const newValue = currentValue ? `${currentValue} ${operator.usage}` : operator.usage;
        searchInput.value = newValue;
        searchInput.focus();
        
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      
      menu.style.display = 'none';
    });

    menu.appendChild(item);
  });

  filterBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = menu.style.display === 'block';
    
    if (isVisible) {
      menu.style.display = 'none';
    } else {
      menu.style.display = 'block';
    }
  });

  document.addEventListener('click', (e) => {
    if (!filterBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  filterBtn.appendChild(menu);

  const parentElement = clearBtn.parentElement || clearBtn.parentNode;
  if (parentElement) {
    parentElement.insertBefore(filterBtn, clearBtn);
  }
}

function insertAllTabs() {
  insertMapsTab();
  insertOrthoTab();
  insertTrendsTab();
  insertChatgptButton();
  insertFilterButton();
}

const observer = new MutationObserver(insertAllTabs);
observer.observe(document.body, { childList: true, subtree: true });

insertAllTabs();
