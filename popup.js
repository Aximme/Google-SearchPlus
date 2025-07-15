document.addEventListener('DOMContentLoaded', () => {
  const settings = [
    { id: 'toggleMaps',      key: 'mapsEnabled' },
    { id: 'toggleSponsors',  key: 'sponsorsEnabled' },
    { id: 'toggleChatGPT',   key: 'chatGptEnabled' },
    { id: 'toggleOperators', key: 'operatorsEnabled' },
    { id: 'toggleOrtho',     key: 'orthoEnabled' },
    { id: 'toggleTrends',    key: 'trendsEnabled' }
  ];

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
});
