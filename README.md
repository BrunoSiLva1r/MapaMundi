# Mesa Mundi — Landing page + aplicação

## Estrutura
- `index.html`: landing page pública.
- `app.html`: aplicação/protótipo existente; abre na tela de acesso quando não há usuário autenticado.
- `css/landing.css` e `js/landing.js`: estilos e interações da landing page.
- `css/app.css` e `js/app.js`: estilos e lógica da aplicação existente.
- `js/theme.js`: paletas por culinária (México, Itália, Japão). O tema escolhido na landing fica salvo e também é aplicado no app; no app dá para trocar pelo seletor de bandeiras no menu lateral.
- `images/`: fotos usadas nos banners e no destaque da landing.

## Como testar
Abra `index.html` em um navegador. Os botões **Experimentar agora** e **Entrar** levam para `app.html`, que apresenta a tela de login/cadastro do protótipo.

Para uma experiência completa, sirva a pasta com um servidor local (por exemplo, Live Server no VS Code).

A lógica da aplicação original foi preservada; a landing page foi criada separadamente para não misturar a apresentação pública com o sistema.

## Backend + banco de dados (PostgreSQL)

Usuários (cadastro, login, perfil, gestão pelo administrador e pontos) agora ficam no PostgreSQL.

### Como rodar
1. Crie o banco: `createdb mesamundi` (ou pelo pgAdmin).
2. `cd server && cp .env.example .env` e ajuste `DATABASE_URL` e `JWT_SECRET`.
3. `npm install`
4. `npm run db:init` — cria a tabela `usuarios` e insere os 8 usuários de teste (só se estiver vazia).
5. `npm start` e abra http://localhost:3000

### Usuários de teste (senha `12345678`)
mariana@email.com (Consumidor), carlos@email.com (Empreendedor), rafael@email.com (Administrador),
paulo@, ana@, minjun@, samir@ e beatriz@email.com (inativa).

### API
- `POST /api/auth/login`, `POST /api/auth/register`
- `GET/PUT/DELETE /api/auth/me`
- `GET/POST /api/users`, `PUT/DELETE /api/users/:id`, `PATCH /api/users/:id/active`, `POST /api/users/:id/points` (somente administrador)

Senhas são salvas com bcrypt; a sessão usa JWT (guardado em `sessionStorage`).
Restaurantes, reservas e avaliações ainda estão em memória no `app.js`.
