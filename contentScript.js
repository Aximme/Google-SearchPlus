function insertMapsTab() {
  chrome.storage.local.get({ mapsEnabled: true }, data => {
    if (!data.mapsEnabled) return;
    if (document.getElementById('maps-tab')) return;

    const listContainer = document.querySelector('div[role="list"][style*="display:contents"]');
    if (!listContainer) return;
    const items = Array.from(listContainer.children);

    const imagesItem = items.find(item => {
      const a = item.querySelector('a');
      return a && /Images|Images/i.test(a.textContent);
    });
    if (!imagesItem) return;

    const mapsItem = imagesItem.cloneNode(true);
    mapsItem.id = 'maps-tab';

    const a = mapsItem.querySelector('a');
    a.removeAttribute('href');
    a.addEventListener('click', e => {
      e.preventDefault();
      const query = document.querySelector('input[name="q"]').value || '';
      window.location.href = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    });

    const label = mapsItem.querySelector('div.YmvwI');
    if (label) label.textContent = 'Maps';

    listContainer.insertBefore(mapsItem, imagesItem);
  });
}

const observer = new MutationObserver(insertMapsTab);
observer.observe(document.body, { childList: true, subtree: true });

insertMapsTab();
