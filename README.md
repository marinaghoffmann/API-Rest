# API-Rest

API REST para gerenciamento e análise de dados de espécies.

## 🚀 Tecnologias

- **Node.js** + **Express**
- **PostgreSQL** com **Prisma ORM**
- **JWT** para autenticação
- **OpenWeatherMap API** para dados climáticos
- **Jest** + **Supertest** para testes

## 📦 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL rodando localmente ou via Docker

### 1. Clone o repositório

```bash
git clone https://github.com/marinaghoffmann/API-Rest
cd API-Rest
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações.

> A chave da OpenWeatherMap é gratuita em: https://openweathermap.org/api

### 4. Execute as migrations

```bash
npx prisma migrate dev --name init
```

### 5. Inicie o servidor

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🔑 Autenticação

Todas as rotas de espécies exigem autenticação via JWT.

1. Registre um usuário via `POST /api/auth/register`
2. Faça login via `POST /api/auth/login` e obtenha o token
3. Envie o token no header: `Authorization: Bearer <token>`

## 📌 Endpoints

### Auth

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register` | Registra novo usuário |
| POST | `/api/auth/login` | Autentica e retorna JWT |

### Espécies (requer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/species` | Lista todas as espécies |
| GET | `/api/species?category=ave` | Filtra por categoria |
| GET | `/api/species?name=arara` | Busca por nome |
| GET | `/api/species/stats` | Estatísticas por categoria |
| GET | `/api/species/:id` | Busca espécie por ID |
| POST | `/api/species` | Cadastra nova espécie |
| PUT | `/api/species/:id` | Atualiza espécie |
| DELETE | `/api/species/:id` | Remove espécie |

### Exemplo de corpo para cadastro de espécie

```json
{
  "commonName": "Arara-azul",
  "scientificName": "Anodorhynchus hyacinthinus",
  "category": "ave",
  "latitude": -15.7801,
  "longitude": -47.9292
}
```

### Health Check
GET /health

## 🧪 Testes

```bash
npm test
```

## 🗂️ Estrutura do Projeto
## 🗂️ Estrutura do Projeto

```
API-Rest/
prisma/
  schema.prisma
src/
  config/
    prisma.js
  controllers/
    authController.js
    speciesController.js
  middlewares/
    auth.js
    errorHandler.js
  routes/
    authRoutes.js
    speciesRoutes.js
  services/
    weatherService.js
  tests/
    auth.test.js
    species.test.js
  utils/
    AppError.js
  app.js
  server.js
.env.example
.gitignore
package.json
README.md
```
