// Temas por culinária, compartilhados entre a landing page e o app.
// A escolha feita na landing fica salva e é aplicada no app também.
(function () {
  const THEMES = {
    mexico: { primary: '#018D3E', text: '#FDF7E6', detail: '#E71506', surface: '#016F32', label: '🌮 Uma viagem pelo México', image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800', flag: '🇲🇽', name: 'México',
      code: 'MX', city: 'Cidade do México', lat: 19.43, lon: -99.13, km: 7436, dish: 'Tacos al pastor', note: 'Os tacos estão bem mais perto.' },
    italia: { primary: '#FA4100', text: '#FFFFFF', detail: '#81F002', surface: '#C83200', label: '🍝 Uma viagem pela Itália', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800', flag: '🇮🇹', name: 'Itália',
      code: 'IT', city: 'Roma', lat: 41.90, lon: 12.50, km: 8988, dish: 'Massa fresca', note: 'A massa fresca está bem mais perto.' },
    japao:  { primary: '#4B1028', text: '#FEFEFD', detail: '#FE7C00', surface: '#350B1C', label: '🍣 Uma viagem pelo Japão', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', flag: '🇯🇵', name: 'Japão',
      code: 'JP', city: 'Tóquio', lat: 35.68, lon: 139.65, km: 18228, dish: 'Sushi', note: 'Quase o outro lado do mundo. O sushi está bem mais perto.' }
  };
  // Ponto de partida das rotas no mapa da landing
  const ORIGEM = { city: 'Belo Horizonte', lat: -19.92, lon: -43.93 };
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
  window.MesaTheme = { themes: THEMES, origem: ORIGEM, apply, current, hasSaved: () => Boolean(THEMES[saved()]) };
})();
