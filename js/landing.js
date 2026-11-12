// Interações da landing page: troca de tema ao clicar nos banners de culinária.
// As paletas ficam em js/theme.js e a escolha é lembrada no app.
document.getElementById('year').textContent = new Date().getFullYear();

const cards = document.querySelectorAll('.culture-card');
const heroImage = document.getElementById('hero-image');
const heroLabel = document.getElementById('hero-label');

function showTheme(name, animate) {
  const theme = MesaTheme.themes[name];
  if (!theme) return;

  cards.forEach((card) => {
    const isActive = card.dataset.theme === name;
    card.classList.toggle('active', isActive);
    card.setAttribute('aria-pressed', String(isActive));
  });

  const swap = () => {
    heroImage.src = theme.image;
    heroImage.alt = 'Comida típica: ' + theme.name;
    heroLabel.textContent = theme.label;
    heroImage.style.opacity = '1';
  };

  if (animate) {
    heroImage.style.opacity = '0';
    setTimeout(swap, 200);
  } else {
    swap();
  }
}

cards.forEach((card) => {
  card.addEventListener('click', () => {
    MesaTheme.apply(card.dataset.theme, true);
    showTheme(card.dataset.theme, true);
  });
});

// Mostra o tema escolhido na última visita
showTheme(MesaTheme.current(), false);
