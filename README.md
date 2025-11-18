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
<img width="912" height="914" alt="UML - Sportsbreeze drawio" src="https://github.com/user-attachments/assets/138254d7-b741-4419-a117-d6dcc190345a" />

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
