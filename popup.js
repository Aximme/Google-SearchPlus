document.addEventListener('DOMContentLoaded', () => {
  const settings = [
    { id: 'toggleMaps',       key: 'mapsEnabled' },
    { id: 'toggleSponsors',   key: 'sponsorsEnabled' },
    { id: 'toggleChatGPT',    key: 'chatGptEnabled' },
    { id: 'toggleOperators',  key: 'operatorsEnabled' },
    { id: 'toggleCustomCats', key: 'customCatsEnabled' },
    { id: 'toggleOrtho',      key: 'orthoEnabled' },
    { id: 'toggleTrends',     key: 'trendsEnabled' }
  ];

  const ids = settings.map(s => s.id);
  const defaults = {};
  settings.forEach(s => defaults[s.key] = true);
  chrome.storage.local.get(defaults, data => {
    settings.forEach(s => {
      const cb = document.getElementById(s.id);
      if (cb) cb.checked = data[s.key];
    });
  });

  settings.forEach(s => {
    const cb = document.getElementById(s.id);
    if (!cb) return;
    cb.addEventListener('change', () => {
      chrome.storage.local.set({ [s.key]: cb.checked });
    });
  });

  const searchParam = document.getElementById('searchParam');
  const optionEls = Array.from(document.querySelectorAll('.option'));
  const groupEls  = Array.from(document.querySelectorAll('.category-group'));
  searchParam.addEventListener('input', () => {
    const q = searchParam.value.trim().toLowerCase();
    // options individuelles
    optionEls.forEach(opt => {
      const txt = opt.dataset.search;
      opt.style.display = txt.includes(q) ? 'flex' : 'none';
    });
    groupEls.forEach(gr => {
      const txtGroup = gr.dataset.search;
      const subs = Array.from(gr.querySelectorAll('.option'));
      const anySub = subs.some(opt => opt.dataset.search.includes(q));
      gr.style.display = (txtGroup.includes(q) || anySub) ? 'flex' : 'none';
    });
  });
});