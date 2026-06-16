# ⚽ Futebol Manager — Fullstack PWA

Aplicação fullstack para gerenciamento de times e partidas de futebol.

## Tecnologias
- **Frontend:** React + Vite + PWA (vite-plugin-pwa)
- **Backend:** Node.js + Express
- **Banco de dados:** MongoDB Atlas (via Mongoose)

---

## Estrutura
```
futebol-app/
├── backend/      # Node.js + Express + Mongoose
└── frontend/     # React + Vite + PWA
```

---

## Como rodar localmente

### Backend
```bash
cd backend
npm install
cp .env.example .env   # preencha com sua string do MongoDB Atlas
npm run dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # coloque a URL do backend (ou deixe vazio para localhost)
npm run dev
```

---

## Deploy

### Backend → Render.com
1. Crie uma conta em https://render.com
2. Novo → Web Service → conecte o repo do backend
3. Build command: `npm install`
4. Start command: `node src/server.js`
5. Adicione a variável de ambiente `MONGODB_URI` com sua string do MongoDB Atlas

### Frontend → Netlify
1. Crie uma conta em https://netlify.com
2. Novo site → importe o repo do frontend
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Adicione a variável de ambiente `VITE_API_URL` com a URL do backend no Render

### MongoDB → Atlas
1. Acesse https://cloud.mongodb.com
2. Crie um cluster gratuito (M0)
3. Crie um usuário de banco de dados
4. Libere o IP `0.0.0.0/0` no Network Access
5. Copie a connection string para o `.env` do backend

---

## Entidades

### Time
- `nome`, `cidade`, `escudo` (emoji), `fundacao`
- Estatísticas automáticas: `vitorias`, `empates`, `derrotas`

### Partida (nova entidade CRUD)
- `timeCasa`, `timeVisitante` (refs para Time)
- `golsCasa`, `golsVisitante`, `data`, `estadio`
- `status`: agendada | em andamento | encerrada
- Ao encerrar uma partida, as estatísticas dos times são atualizadas automaticamente

## API Endpoints

### Times
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/times | Lista todos |
| GET | /api/times/:id | Busca por ID |
| POST | /api/times | Cria novo |
| PUT | /api/times/:id | Atualiza |
| DELETE | /api/times/:id | Remove |

### Partidas
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/partidas | Lista todas |
| GET | /api/partidas/:id | Busca por ID |
| POST | /api/partidas | Cria nova |
| PUT | /api/partidas/:id | Atualiza (atualiza stats se encerrada) |
| DELETE | /api/partidas/:id | Remove |
