// Landing page do Mesa Mundi.
// - Desenha o mapa-múndi de pontos e a rota de Belo Horizonte até a culinária escolhida.
// - Trocar de culinária (botões do mapa ou cartões) muda o tema do site inteiro.
// As paletas e os dados de cada destino ficam em js/theme.js.

document.getElementById('ano').textContent = new Date().getFullYear();

// Continentes em grade de 120 x 47 pontos (projeção equiretangular, latitude 84° a -57°,
// 3° por ponto). Gerado a partir do Natural Earth 1:110m (domínio público).
// Cada linha é uma fileira; cada dígito hexadecimal são 4 pontos (1 = terra).
const MAPA = [
  '00000003fffffa0000000000000000',
  '0000005ffffffc00f800001a000000',
  '00000f2fc7fffc004000e01fc03000',
  '00003cbbc07ff800000211fffe1000',
  '83f8d7cbf83ff8001e023fffffff86',
  'e7ffffff9e3fc0007fdfffffffffff',
  '07ffffffbe1e0601efffffffffffff',
  '07fffff83c1c0003dffffffffffffe',
  '0383fff83e000023cffffffffff040',
  '0000ffff3f8000319fffffffffc0c0',
  '00007fffbf80007ffffffffffff080',
  '00007fffffc0003ffffffffffff000',
  '00003fffff00001fffffffffffd000',
  '00003ffff800007ffc7fffffff9000',
  '00003ffff00000707ffffffffe0000',
  '00001fffe000007297fffffffa2000',
  '00000fffc000003f08fffffff2e000',
  '000007ff8000007ffffffffff90000',
  '000003f0800000fffff7fffff80000',
  '000002f0000001fffffbfffff00000',
  '00000070400003ffff7f1fffe00000',
  '00000072280003fffffe0f9f800000',
  '0000001f000003ffffbc0f1f080000',
  '00000003000003fffff00607800000',
  '000000011f0001fffff80603040000',
  '000000003f8000fffff80204040000',
  '000000003fe00073fff0000e300000',
  '000000007fe00001ffe00006fa0000',
  '000000007ff80001ffc00006e88000',
  '000000007fff0000ff800003087800',
  '000000007fff8000ff800001c03800',
  '000000003fff0000ffc00000000400',
  '000000003ffe0000ffc8000001d000',
  '000000001ffe0000ff98000007d800',
  '000000000ffe0000ff1000000ff800',
  '000000000ffc00007f3000003ffc00',
  '000000000ff000007e0000003ffe00',
  '000000000ff000007e0000003ffe00',
  '000000000fe000003c0000003ffe00',
  '000000000fc0000030000000387c00',
  '000000001f80000000000000001c02',
  '000000001e00000000000000000002',
  '000000001e0000000000000000080c',
  '000000001c00000000000000000008',
  '000000001c00000000000000000000',
  '000000001800000000000000000000',
  '000000000c00000000000000000000',
];

const COLS = 120;
const LAT_TOPO = 84;
const PASSO = 3;

const pontosTerra = [];
MAPA.forEach((linha, r) => {
  for (let i = 0; i < linha.length; i++) {
    const n = parseInt(linha[i], 16);
    for (let b = 0; b < 4; b++) {
      if (n & (8 >> b)) pontosTerra.push([i * 4 + b, r]);
    }
  }
});

const canvas = document.getElementById('mapa-canvas');
const ctx = canvas.getContext('2d');
const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let destinoAtual = MesaTheme.current();
let progresso = 1;      // 0 a 1: quanto da rota já foi desenhado
let animacao = null;

// latitude/longitude -> posição no canvas (em pixels CSS)
function projetar(lat, lon, largura) {
  const celula = largura / COLS;
  return {
    x: ((lon + 180) / PASSO) * celula,
    y: ((LAT_TOPO - lat) / PASSO) * celula,
  };
}

function cor(nome) {
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim();
}

function desenhar() {
  const largura = canvas.clientWidth;
  const altura = canvas.clientHeight;
  if (!largura) return;
  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== Math.round(largura * dpr) || canvas.height !== Math.round(altura * dpr)) {
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, largura, altura);

  const celula = largura / COLS;
  const raio = Math.max(0.9, celula * 0.3);
  const corTexto = cor('--text');
  const corDestaque = cor('--detail');

  // 1. continentes
  ctx.fillStyle = corTexto;
  ctx.globalAlpha = 0.26;
  ctx.beginPath();
  for (const [c, r] of pontosTerra) {
    const x = (c + 0.5) * celula;
    const y = (r + 0.5) * celula;
    ctx.moveTo(x + raio, y);
    ctx.arc(x, y, raio, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.globalAlpha = 1;

  // 2. rota (curva pontilhada de BH até o destino)
  const tema = MesaTheme.themes[destinoAtual];
  const origem = MesaTheme.origem;
  const a = projetar(origem.lat, origem.lon, largura);
  const b = projetar(tema.lat, tema.lon, largura);
  const distancia = Math.hypot(b.x - a.x, b.y - a.y);
  const controle = {
    x: (a.x + b.x) / 2,
    y: Math.max(celula * 2, Math.min(a.y, b.y) - distancia * 0.32),
  };
  const ponto = (t) => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * controle.x + t ** 2 * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * controle.y + t ** 2 * b.y,
  });

  const passos = Math.max(24, Math.round(distancia / (celula * 1.1)));
  ctx.fillStyle = corDestaque;
  for (let i = 0; i <= passos; i++) {
    const t = i / passos;
    if (t > progresso) break;
    const p = ponto(t);
    ctx.beginPath();
    ctx.arc(p.x, p.y, raio * 1.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. origem (BH) e destino; cada nome fica do lado oposto ao da rota
  const destinoAEsquerda = b.x < a.x;
  marcar(a, corTexto, raio, origem.city, destinoAEsquerda ? 'direita' : 'esquerda', largura);
  if (progresso >= 1) marcar(b, corDestaque, raio, tema.city, destinoAEsquerda ? 'esquerda' : 'direita', largura);
}

function marcar(p, corPonto, raio, nome, lado, largura) {
  ctx.fillStyle = corPonto;
  ctx.beginPath();
  ctx.arc(p.x, p.y, raio * 2.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = corPonto;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.arc(p.x, p.y, raio * 5.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // nome da cidade (só em telas onde cabe)
  if (largura < 520) return;
  const tamanho = Math.round(Math.min(14, Math.max(11, largura / 80)));
  ctx.font = `600 ${tamanho}px "DM Sans", system-ui, sans-serif`;
  ctx.fillStyle = cor('--text');
  const largTexto = ctx.measureText(nome).width;
  const afastamento = raio * 7;
  let paraDireita = lado === 'direita';
  // se não couber no canvas, vira para o outro lado
  if (paraDireita && p.x + afastamento + largTexto > largura - 4) paraDireita = false;
  if (!paraDireita && p.x - afastamento - largTexto < 4) paraDireita = true;
  ctx.textAlign = paraDireita ? 'left' : 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText(nome, paraDireita ? p.x + afastamento : p.x - afastamento, p.y);
}

function animarRota() {
  cancelAnimationFrame(animacao);
  if (reduzirMovimento) { progresso = 1; desenhar(); return; }
  const inicio = performance.now();
  const duracao = 1100;
  const quadro = (agora) => {
    const t = Math.min(1, (agora - inicio) / duracao);
    progresso = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2; // suaviza início e fim
    desenhar();
    if (t < 1) animacao = requestAnimationFrame(quadro);
  };
  animacao = requestAnimationFrame(quadro);
}

// ---------- Legenda da rota ----------

const formatoKm = new Intl.NumberFormat('pt-BR');

function atualizarLegenda(nome) {
  const tema = MesaTheme.themes[nome];
  document.getElementById('rota-origem').textContent = MesaTheme.origem.city;
  document.getElementById('rota-destino').textContent = tema.city;
  document.getElementById('rota-km').textContent = formatoKm.format(tema.km);
  document.getElementById('rota-nota').textContent = tema.note;
}

// ---------- Troca de culinária ----------

const seletores = document.querySelectorAll('button[data-theme]');

function escolher(nome, animar) {
  if (!MesaTheme.themes[nome]) return;
  destinoAtual = nome;
  seletores.forEach((el) => el.setAttribute('aria-pressed', String(el.dataset.theme === nome)));
  atualizarLegenda(nome);
  if (animar) animarRota(); else { progresso = 1; desenhar(); }
}

seletores.forEach((el) => {
  el.addEventListener('click', () => {
    MesaTheme.apply(el.dataset.theme, true);
    escolher(el.dataset.theme, true);
  });
});

// As cores mudam com transição de 0,7 s; redesenha o mapa quando ela termina
document.addEventListener('mesamundi:tema', () => setTimeout(desenhar, 720));

new ResizeObserver(() => desenhar()).observe(canvas);
if (document.fonts) document.fonts.ready.then(() => desenhar());

escolher(destinoAtual, false);
animarRota();
