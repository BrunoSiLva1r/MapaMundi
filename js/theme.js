// Temas por culinária, compartilhados entre a landing page e o app.
// A escolha feita na landing fica salva e é aplicada no app também.
(function () {
  const THEMES = {
    mexico: { primary: '#018D3E', text: '#FDF7E6', detail: '#E71506', surface: '#016F32', label: '🌮 Uma viagem pelo México', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800', flag: '🇲🇽', name: 'México' },
    italia: { primary: '#FA4100', text: '#FFFFFF', detail: '#81F002', surface: '#C83200', label: '🍝 Uma viagem pela Itália', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800', flag: '🇮🇹', name: 'Itália' },
    japao:  { primary: '#4B1028', text: '#FEFEFD', detail: '#FE7C00', surface: '#350B1C', label: '🍣 Uma viagem pelo Japão', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', flag: '🇯🇵', name: 'Japão' }
  };
  const KEY = 'mesamundi-tema';

  function saved() {
    try { return localStorage.getItem(KEY); } catch (err) { return null; }
  }

  function current() {
    const name = saved();
    return THEMES[name] ? name : 'mexico';
  }

  function apply(name, persist) {
    const theme = THEMES[name];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--text', theme.text);
    root.style.setProperty('--detail', theme.detail);
    root.style.setProperty('--surface', theme.surface);
    root.dataset.culture = name;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme.primary);
    if (persist) {
      try { localStorage.setItem(KEY, name); } catch (err) { /* sem armazenamento: só não lembra */ }
    }
    document.dispatchEvent(new CustomEvent('mesamundi:tema', { detail: name }));
  }

  apply(current(), false);
  window.MesaTheme = { themes: THEMES, apply, current, hasSaved: () => Boolean(THEMES[saved()]) };
})();
