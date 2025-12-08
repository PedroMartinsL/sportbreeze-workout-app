 # SportBreeze Workout App 
O **SportBreeze** é um aplicativo mobile completo desenvolvido em **React Native (Expo)** com backend **FastAPI** que auxilia usuários a organizarem suas rotinas de treino e atividades esportivas de forma inteligente e personalizada.

O app combina **autenticação segura**, **gestão de perfil**, **planejamento de rotinas semanais**, **monitoramento GPS**, **recomendações climáticas via IA** e **painel administrativo** para controle e análise de estatísticas.

---

## ✨ Funcionalidades

### 👤 Autenticação e Perfil
- ✅ **Registro e Login** com JWT (Access Token + Refresh Token)
- ✅ **Perfil personalizável** com nome, idade, peso, altura, nível de atividade
- ✅ **Controle de acesso**: usuários normais e administradores
- ✅ **Logout seguro** com limpeza de tokens

### 📅 Rotinas de Treino
- ✅ **Criação de rotinas semanais** com múltiplos workouts por dia
- ✅ **Gestão de atividades** (adicionar, editar, excluir)
- ✅ **Visualização por dia da semana** com cards organizados
- ✅ **Persistência de dados** sincronizada com backend

### 🌤️ Recomendações Inteligentes
- ✅ **Integração com IA (Google Gemini)** para sugestões baseadas no clima
- ✅ **API de clima em tempo real** (WeatherAPI)
- ✅ **Notificações push** via OneSignal para lembretes de treino

### 📍 Monitoramento GPS
- ✅ **Rastreamento de localização** durante atividades
- ✅ **Mapa interativo** para visualizar trajetos
- ✅ **Permissões de localização** gerenciadas automaticamente

### 📊 Painel Administrativo
- ✅ **Dashboard exclusivo para admins** (Statistics)
- ✅ **Visualização de estatísticas** de todos os usuários
- ✅ **Controle de visibilidade** via roles (admin/client)
- ✅ **Interface condicional** baseada em autenticação

---

## 🚀 Tecnologias Utilizadas

### Frontend (Mobile)
- **React Native** v0.81.4 – Framework mobile multiplataforma
- **Expo** v54 – Ambiente de desenvolvimento e build
- **Expo Router** v6 – Navegação file-based routing
- **TypeScript** – Tipagem estática
- **Zustand** – Gerenciamento de estado global
- **NativeWind** – Tailwind CSS para React Native
- **Lucide Icons** – Ícones modernos e leves
- **React Native Maps** – Integração com GPS
- **JWT Decode** – Decodificação de tokens
- **Expo SecureStore** – Armazenamento seguro de credenciais
- **React Native Toast** – Feedback visual ao usuário

### Backend (API)
- **FastAPI** v0.118 – Framework web moderno e rápido
- **Python** 3.11+ – Linguagem base
- **PostgreSQL** 15 – Banco de dados relacional
- **SQLAlchemy** v2.0 – ORM
- **Alembic** – Migrations de banco
- **Pydantic** – Validação de dados
- **Python-JOSE** – JWT handling
- **Bcrypt** – Hash de senhas
- **Uvicorn** – ASGI server
- **APScheduler** – Agendamento de tarefas
- **Google Gemini AI** – Integração com IA
- **WeatherAPI** – API de clima
- **OneSignal** – Push notifications
- **Pytest** – Testes unitários

### Infraestrutura
- **Docker** & **Docker Compose** – Containerização
- **pgAdmin** – Interface de administração do PostgreSQL

---

## 🧪 Testes

O projeto utiliza diferentes tipos de testes para garantir a qualidade do código:

- **Testes Unitários:** Validação de regras de negócio e casos de uso isolados (Pytest, com mocks).
- **Testes de Integração:** Validação do funcionamento entre componentes reais (Pytest, banco SQLite/PostgreSQL).
- **Testes de Sistema:** Automação de cenários completos simulando o uso real da aplicação. Para estes, foi utilizado **Selenium**.

### Instruções para execução dos testes

1. **Testes Unitários e de Integração (backend):**
   - Acesse a pasta do backend:
     ```powershell
     cd backend
     ```
   - Execute os testes:
     ```powershell
     pytest
     ```

2. **Testes de Sistema:**
   - Certifique-se de que o backend está rodando:
     ```powershell
     start.bat
     ```
   - Execute os scripts de teste com Selenium conforme instruções na pasta de testes de sistema.

> **Observação:** Não é necessário iniciar o frontend ou o Docker para rodar os testes unitários/integrados. Para testes de sistema, o backend deve estar ativo.

---

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ e npm/yarn
- Python 3.11+
- Docker e Docker Compose
- Expo Go (app mobile para testes)

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/PedroMartinsL/sportbreeze-workout-app.git
cd sportbreeze-workout-app
```

### 2️⃣ Configuração do Backend

#### Com Docker (Recomendado)
```bash
# Criar arquivo .env no diretório backend/
cd backend
cp .env.example .env  # Configure as variáveis necessárias

# Subir os containers
cd ..
docker-compose up -d

# Verificar logs
docker-compose logs -f backend
```

#### Sem Docker
```bash
cd backend

# Criar ambiente virtual
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instalar dependências
pip install -r requirements.txt

# Configurar .env
cp .env.example .env

# Rodar migrações
alembic upgrade head

# Iniciar servidor
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Variáveis de Ambiente (Backend)
```env
# Database
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=upe
POSTGRES_PASSWORD=upe
POSTGRES_DB=upe_db

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# External APIs
GEMINI_API_KEY=your-gemini-api-key
WEATHER_API_KEY=your-weather-api-key
ONESIGNAL_APP_ID=your-onesignal-app-id
ONESIGNAL_API_KEY=your-onesignal-api-key
```

### 3️⃣ Configuração do Frontend

```bash
cd frontend

# Instalar dependências
npm install
# ou
yarn install

# Criar arquivo .env
cp .env.example .env
```

#### Variáveis de Ambiente (Frontend)
```env
EXPO_PUBLIC_IP_FETCH=http://192.168.x.x:8000
```
*Substitua `192.168.x.x` pelo IP local da sua máquina*

#### Iniciar o app
```bash
npx expo start --port 8080

# Opções:
# - Pressione 'a' para abrir no Android
# - Escaneie o QR Code com Expo Go
# - Pressione 'w' para abrir no navegador (experimental)
```

---

## 📲 Uso

### Fluxo de Usuário
1. **Registre-se** na tela de registro com email e senha
2. **Faça login** para acessar o app
3. **Complete seu perfil** com informações pessoais
4. **Crie rotinas** semanais com atividades personalizadas
5. **Visualize sugestões** de treino baseadas no clima
6. **Monitore suas atividades** com GPS
7. **Acesse estatísticas** (apenas admins)

### Acesso Administrativo
Para criar um usuário admin:
```sql
-- Conectar ao PostgreSQL e executar:
UPDATE users SET admin = true WHERE email = 'admin@example.com';
```

---

## 📂 Estrutura do Projeto

```
sportbreeze-workout-app/
├── backend/                    # Backend FastAPI
│   ├── alembic/               # Migrations
│   ├── api/                   # Routers e Controllers
│   │   ├── routes.py
│   │   └── controllers/
│   ├── application/           # Casos de uso e serviços
│   │   ├── services/
│   │   └── use_cases/
│   ├── core/                  # Configurações
│   ├── domain/                # Entidades e repositórios
│   │   ├── entities/
│   │   └── repositories/
│   ├── infrastructure/        # Banco, segurança, APIs externas
│   │   ├── database/
│   │   ├── security/
│   │   └── services/
│   ├── schemas/               # Pydantic schemas
│   ├── tests/                 # Testes unitários
│   ├── main.py               # Entry point
│   └── requirements.txt
│
├── frontend/                  # Frontend React Native
│   ├── app/                  # Rotas (Expo Router)
│   │   ├── (tabs)/          # Tab navigation
│   │   │   ├── index.tsx    # Home
│   │   │   ├── registration.tsx
│   │   │   ├── routine.tsx
│   │   │   ├── gps.tsx
│   │   │   ├── about.tsx
│   │   │   └── statistics.tsx
│   │   ├── week/            # Visualização semanal
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── components/           # Componentes reutilizáveis
│   ├── services/            # API client
│   ├── store/               # Zustand stores
│   ├── utils/               # Utilitários
│   ├── assets/              # Imagens e fontes
│   └── package.json
│
├── frontend-web/             # Versão web (legacy)
├── docker-compose.yml        # Orquestração de containers
└── README.md
```

---

## 🔌 API Endpoints - Documentação Completa

### 📋 Convenções
- 🔓 **Público** - Não requer autenticação
- 🔒 **Autenticado** - Requer token JWT no header
- 👑 **Admin** - Requer token JWT + role admin
- 🌐 **Serviço Externo** - Utiliza API de terceiros
- 💻 **Lógica Própria** - Implementação interna

---

### 🔐 Autenticação (`/auth`)

#### `POST /auth/sing_up` 🔓
**Descrição:** Criar nova conta de usuário  
**Caso de Uso:** `CreateUserUseCase`  
**Lógica:** 💻 Própria - Hash de senha (Bcrypt), validação de dados  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```
**Response:** Dados do usuário criado

---

#### `POST /auth/login` 🔓
**Descrição:** Autenticar usuário e gerar tokens JWT  
**Caso de Uso:** `AuthService.login()`  
**Lógica:** 💻 Própria - Autenticação JWT (Python-JOSE), geração de access + refresh token  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```
**Response:**
```json
{
  "access_token": "eyJ0eXAi...",
  "refresh_token": "eyJ0eXAi...",
  "token_type": "bearer",
  "user": { "id": 1, "email": "user@example.com", "admin": false }
}
```

---

#### `POST /auth/refresh` 🔒
**Descrição:** Renovar access token usando refresh token  
**Caso de Uso:** Token refresh automático  
**Lógica:** 💻 Própria - Validação e geração de novo JWT  
**Headers:** `Authorization: Bearer <refresh_token>`  
**Response:** Novo access token

---

#### `POST /auth/login-form` 🔓
**Descrição:** Login via OAuth2 Form (para Swagger /docs)  
**Caso de Uso:** `AuthService` (mesma lógica do /login)  
**Lógica:** 💻 Própria - Compatibilidade com OAuth2PasswordRequestForm  

---

### 👤 Perfil (`/profile`)

#### `POST /profile/` 🔒
**Descrição:** Criar perfil do usuário autenticado  
**Caso de Uso:** `CreateProfileUseCase`  
**Lógica:** 💻 Própria - Associação automática com user_id do token  
**Request Body:**
```json
{
  "name": "João Silva",
  "age": 25,
  "weight": 75.5,
  "height": 1.75,
  "activity_level": "moderate"
}
```
**Response:** Dados do perfil criado

---

#### `GET /profile/` 🔒
**Descrição:** Buscar perfil do usuário autenticado  
**Caso de Uso:** `FindProfileByUserUseCase`  
**Lógica:** 💻 Própria - Query no banco de dados  
**Response:** Dados do perfil

---

#### `PUT /profile/` 🔒
**Descrição:** Atualizar perfil do usuário autenticado  
**Caso de Uso:** `UpdateProfileUseCase`  
**Lógica:** 💻 Própria - Update no banco de dados  
**Request Body:** Mesma estrutura do POST (campos opcionais)  
**Response:** Perfil atualizado

---

### 📅 Rotinas (`/routines`)

#### `POST /routines/` 🔒
**Descrição:** Criar nova rotina semanal  
**Caso de Uso:** `CreateRoutineUseCase`  
**Lógica:** 💻 Própria - Associação com user_id, validação de dia da semana  
**Request Body:**
```json
{
  "day": "monday"
}
```
**Response:** Rotina criada com ID

---

#### `GET /routines/` 🔒
**Descrição:** Buscar todas as rotinas do usuário autenticado  
**Caso de Uso:** `FindRoutinesByUserUseCase`  
**Lógica:** 💻 Própria - Query filtrada por user_id  
**Response:** Lista de rotinas agrupadas por dia da semana

---

### 🏋️ Workouts (`/workouts`)

#### `POST /workouts/` 🔒
**Descrição:** Criar workout com recomendações de IA baseadas no clima  
**Caso de Uso:** `CreateWorkoutByGoalsUseCase`  
**Lógica:**  
- 💻 **Própria:** Validação, persistência no banco  
- 🌐 **WeatherAPI:** Consulta clima atual por localização  
- 🌐 **Google Gemini AI:** Geração de sugestões de treino baseadas no clima  

**Request Body:**
```json
{
  "routine_id": 1,
  "goals": "Perder peso e ganhar resistência",
  "location": "Recife, PE"
}
```
**Response:** Workout criado com sugestões da IA

**Fluxo:**
1. Sistema consulta **WeatherAPI** com localização
2. Envia clima + objetivos para **Gemini AI**
3. IA retorna recomendação personalizada
4. Sistema salva workout no banco

---

#### `GET /workouts/{routine_id}` 🔒
**Descrição:** Buscar todos os workouts de uma rotina  
**Caso de Uso:** `FindWorkoutsByRoutineUseCase`  
**Lógica:** 💻 Própria - Query no banco de dados  
**Response:** Lista de workouts da rotina

---

#### `PUT /workouts/{workout_id}` 🔒
**Descrição:** Atualizar workout (marcar como concluído, editar dados)  
**Caso de Uso:** `UpdateWorkoutUseCase` + `SetStatisticsUseCase`  
**Lógica:** 💻 Própria - Update no banco + cálculo automático de estatísticas  
**Request Body:**
```json
{
  "activity": "Corrida",
  "duration": 30,
  "completed": true
}
```
**Response:** Workout atualizado

**Efeito Colateral:** Ao marcar como `completed: true`, o sistema atualiza automaticamente as estatísticas do usuário (calorias queimadas, atividades completadas).

---

#### `DELETE /workouts/{workout_id}` 🔒
**Descrição:** Deletar workout  
**Caso de Uso:** `DeleteWorkoutUseCase`  
**Lógica:** 💻 Própria - Soft delete ou hard delete  
**Response:** Workout deletado

---

### 📱 Dispositivo (`/device`)

#### `POST /device/` 🔒
**Descrição:** Registrar token do dispositivo para notificações push  
**Caso de Uso:** `SetDeviceUseCase`  
**Lógica:**  
- 💻 **Própria:** Associação device_token com user_id  
- 🌐 **OneSignal:** Token usado posteriormente para enviar push notifications  

**Request Body:**
```json
{
  "device_token": "ExponentPushToken[xxxxxx]"
}
```
**Response:** Device registrado

**Integração:** Este token é usado pelo **APScheduler** para enviar notificações via **OneSignal**.

---

### 📊 Estatísticas (`/statistics`)

#### `GET /statistics/me` 🔒
**Descrição:** Buscar estatísticas do usuário autenticado  
**Caso de Uso:** `FindStatisticsByUserUseCase`  
**Lógica:** 💻 Própria - Agregação de dados de workouts completados  
**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "kcal_burned": 1250.5,
  "activity_checked": 15
}
```

**Cálculo:**
- `kcal_burned`: Soma das calorias de todos os workouts completados
- `activity_checked`: Contador de workouts marcados como `completed: true`

---

#### `GET /statistics/` 👑
**Descrição:** Buscar estatísticas de TODOS os usuários (apenas admin)  
**Caso de Uso:** `FindAllStatisticsUseCase`  
**Lógica:** 💻 Própria - Query sem filtro de user_id + validação de role  
**Response:** Lista com estatísticas de todos os usuários

**Validação:** Endpoint retorna `403 Forbidden` se usuário não for admin.

---

## 🔄 Fluxo de Integração com Serviços Externos

### 1️⃣ **Criação de Workout com IA**
```
Frontend → POST /workouts/
    ↓
Backend (CreateWorkoutByGoalsUseCase)
    ↓
WeatherAPI ← Consulta clima por localização
    ↓
Google Gemini AI ← Envia (clima + objetivos)
    ↓
Gemini retorna recomendação
    ↓
Backend salva workout no PostgreSQL
    ↓
Response para Frontend
```

**Lógica Própria:** Orquestração do fluxo, validação, persistência  
**Lógica Terceiros:** Dados climáticos (WeatherAPI) + Geração de texto (Gemini)

---

### 2️⃣ **Notificações Push Agendadas**
```
Backend (APScheduler) → Agenda job diário
    ↓
Job executa → Busca usuários com workouts pendentes
    ↓
OneSignal API ← Envia push notification
    ↓
Dispositivo do usuário recebe notificação
```

**Lógica Própria:** Agendamento (APScheduler), query de workouts pendentes  
**Lógica Terceiros:** Envio de push (OneSignal)

---

### 3️⃣ **Atualização Automática de Estatísticas**
```
Frontend → PUT /workouts/{id} (completed: true)
    ↓
Backend (UpdateWorkoutUseCase)
    ↓
SetStatisticsUseCase → Recalcula estatísticas
    ↓
Atualiza tabela statistics (kcal_burned, activity_checked)
    ↓
Response para Frontend
```

**Lógica Própria:** Cálculo agregado, transações atômicas no banco

---

## 📊 Resumo: Lógica Própria vs Terceiros

| Endpoint | Lógica Própria | Serviços Externos |
|----------|----------------|-------------------|
| `POST /auth/sing_up` | ✅ Hash senha, validação | ❌ |
| `POST /auth/login` | ✅ JWT, autenticação | ❌ |
| `POST /profile/` | ✅ CRUD perfil | ❌ |
| `POST /routines/` | ✅ CRUD rotinas | ❌ |
| `POST /workouts/` | ✅ Orquestração, persistência | 🌐 WeatherAPI + Gemini AI |
| `PUT /workouts/{id}` | ✅ Update + estatísticas | ❌ |
| `POST /device/` | ✅ Registro token | 🌐 OneSignal (usado depois) |
| `GET /statistics/me` | ✅ Agregação dados | ❌ |
| `GET /statistics/` | ✅ Query admin + validação | ❌ |

---

## 🏗️ Arquitetura

### Backend - Clean Architecture
```
┌─────────────────────────────────────┐
│         API Layer (FastAPI)         │
│  ▸ Controllers & Routes             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Application Layer              │
│  ▸ Use Cases & Services             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│         Domain Layer                │
│  ▸ Entities & Repository Interfaces │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      Infrastructure Layer           │
│  ▸ Database, Security, External APIs│
└─────────────────────────────────────┘
```

### Frontend - Component-Based
```
App (Expo Router)
├── Tabs Layout
│   ├── Home (index)
│   ├── Profile (registration)
│   ├── Routine
│   ├── GPS
│   ├── About
│   └── Statistics (Admin only)
├── Auth Screens
│   ├── Login
│   └── Register
└── Store (Zustand)
    ├── Auth Store
    └── Location Store
```

---

## 📈 Roadmap

- ✅ Autenticação JWT completa
- ✅ CRUD de perfis e rotinas
- ✅ Integração com IA e clima
- ✅ Painel administrativo
- ✅ Monitoramento GPS
- 🔲 Histórico de treinos com gráficos
- 🔲 Integração com wearables (Apple Watch, Fitbit)
- 🔲 Gamificação (conquistas e badges)
- 🔲 Compartilhamento social
- 🔲 Modo offline com sincronização
- 🔲 Dark mode

---

## 📊 Diagramas

### Diagrama de Casos de Uso
<img width="2285" height="1900" alt="Sportbreeze - Diagrama de Caso de Uso-1" src="https://github.com/user-attachments/assets/726b2933-8ece-4db4-bd29-37ac3ea52e52" />

### Diagrama de Classes (UML)
<img width="1172" height="914" alt="UML - Sportsbreeze drawio (1)" src="https://github.com/user-attachments/assets/7e9d62eb-ad7a-4e15-8e67-269951b85fe9" />

---

## 🧪 Testes

### Backend
```bash
cd backend

# Rodar todos os testes
pytest

# Com cobertura
pytest --cov=. --cov-report=html

# Testes específicos
pytest tests/unit/user/
```

### Frontend
```bash
cd frontend

# Lint
npm run lint

# Format
npm run format
```

---

## 🚀 Deploy

### Backend (Docker)
```bash
# Build da imagem
docker build -t sportbreeze-backend ./backend

# Deploy em servidor
docker run -d -p 8000:8000 \
  --env-file ./backend/.env \
  sportbreeze-backend
```

### Frontend (EAS Build)
```bash
cd frontend

# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Build para Android
eas build --platform android

# Build para iOS
eas build --platform ios
```

---

## 🤝 Contribuição

Contribuições são muito bem-vindas! Para colaborar:

1. Faça um **fork** do projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit** suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. **Push** para a branch (`git push origin feature/nova-feature`)
5. Abra um **Pull Request**

### Convenções de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Manutenção

---

## 👨‍💻 Desenvolvedores

O **SportBreeze** foi desenvolvido com dedicação por estudantes de Engenharia de Software da UPE:

- [Pedro Martins de Lemos](https://github.com/PedroMartinsL) 
- [Gabriel Lopes de Albuquerque](https://github.com/gabriellopes-eng) 

---

## 📚 Recursos e Documentação

### Backend
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [SQLAlchemy](https://docs.sqlalchemy.org/)
- [Alembic](https://alembic.sqlalchemy.org/)
- [Pydantic](https://docs.pydantic.dev/)

### Frontend
- [Expo Documentation](https://docs.expo.dev/)
- [React Native](https://reactnative.dev/)
- [Expo Router](https://expo.github.io/router/docs/)
- [Zustand](https://docs.pmnd.rs/zustand/)
- [NativeWind](https://www.nativewind.dev/)

### APIs Externas
- [Google Gemini AI](https://ai.google.dev/)
- [WeatherAPI](https://www.weatherapi.com/)
- [OneSignal](https://documentation.onesignal.com/)

---

## 🐛 Problemas Conhecidos

### Expo Router - Tab Condicional
Para ocultar tabs condicionalmente, use `href: null` em vez de renderização condicional:
```tsx
<Tabs.Screen
  name="statistics"
  options={{
    href: isAdmin ? undefined : null,
  }}
/>
```

### Metro Bundler Cache
Se encontrar erros de cache:
```bash
npx expo start --clear
```

---

## 📜 Licença

Este projeto está sob a licença **MIT**.  
Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

⚡ **SportBreeze** – Treine com inteligência, conquiste com disciplina!
