# Mesa Mundi — Landing page + aplicação

## Estrutura
- `index.html`: landing page pública.
- `app.html`: aplicação/protótipo existente; abre na tela de acesso quando não há usuário autenticado.
- `css/landing.css` e `js/landing.js`: estilos e interações da landing page.
- `css/app.css` e `js/app.js`: estilos e lógica da aplicação existente.

## Como testar
Abra `index.html` em um navegador. Os botões **Experimentar agora** e **Entrar** levam para `app.html`, que apresenta a tela de login/cadastro do protótipo.

Para uma experiência completa, sirva a pasta com um servidor local (por exemplo, Live Server no VS Code).

A lógica da aplicação original foi preservada; a landing page foi criada separadamente para não misturar a apresentação pública com o sistema.
