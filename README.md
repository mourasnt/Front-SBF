# SBF Integrações - Front-end

Front-end para gestão de cargas das integrações SBF (Nike e Centauro), desenvolvido com React, TypeScript e Vite.

## 🚀 Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Axios** - HTTP client
- **React Router** - Navegação

## 📋 Funcionalidades

### Integrações Suportadas

- **Nike** - Gestão de cargas Nike
- **Centauro** - Gestão de cargas Centauro

### Autenticação
- Login com JWT token
- Controle de sessão com localStorage
- Redirect automático quando token expira
- Proteção de rotas privadas

### Navegação
- **Sidebar** com navegação entre integrações
- Dashboard dedicado para cada integração
- Cores e estilos diferenciados por integração

### Gestão de Cargas
- **Listagem de cargas**: Tabela com informações principais
- **Busca/Filtro**: Por referência, cliente ou localização
- **Detalhes completos**: Modal com todas as informações da carga
  - CTes do cliente e subcontratados
  - Notas fiscais com status individual
  - Eventos de tracking
  - Agendamentos (Centauro)

### Ações por Carga
- **Atualizar Status**
  - 60+ códigos de status disponíveis
  - Filtro por categoria (Emissão, Trânsito, Finalizada, Pendência, etc.)
  - Upload de anexos
  
- **Upload de CTe XML**
  - Suporte a múltiplos arquivos
  - Validação de formato XML

## 🛠️ Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Backends das integrações (Nike/Centauro) rodando

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Nike API
VITE_API_URL=http://localhost:8000
VITE_NIKE_API_URL=http://localhost:8000

# Centauro API
VITE_CENTAURO_API_URL=http://localhost:8001

# App Settings
VITE_APP_NAME=SBF Integrações
VITE_APP_VERSION=2.0.0
```

### Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### Build para Produção

```bash
npm run build
npm run preview
```

### Deploy com Docker

```bash
# Build e executar com Docker Compose
docker-compose up -d --build

# Ou build manual
docker build \
  --build-arg VITE_NIKE_API_URL=https://api-nike.domain.com \
  --build-arg VITE_CENTAURO_API_URL=https://api-centauro.domain.com \
  -t sbf-integracoes-frontend .

docker run -p 3000:80 sbf-integracoes-frontend
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── MainLayout.tsx   # Layout principal com sidebar
│   ├── Sidebar.tsx      # Navegação entre integrações
│   ├── TopBar.tsx       # Barra superior
│   ├── ShipmentDetailsModal.tsx
│   ├── UpdateStatusModal.tsx
│   └── UploadXmlModal.tsx
├── config/              # Configurações
│   └── integrations.ts  # Configuração das integrações
├── context/             # Contextos React
│   └── IntegrationContext.tsx
├── pages/               # Páginas da aplicação
│   ├── Login.tsx
│   ├── nike/            # Páginas Nike
│   │   └── NikeDashboard.tsx
│   └── centauro/        # Páginas Centauro
│       ├── CentauroDashboard.tsx
│       ├── CentauroShipmentDetailsModal.tsx
│       └── CentauroUpdateStatusModal.tsx
├── services/            # Serviços e API
│   ├── api.ts           # Configuração Axios Nike
│   ├── apiFactory.ts    # Factory para múltiplas APIs
│   ├── auth.ts          # Serviço de autenticação
│   ├── shipments.ts     # Serviço Nike
│   └── centauroShipments.ts  # Serviço Centauro
│   ├── auth.ts        # Serviço de autenticação
│   └── shipments.ts   # Serviço de cargas
├── constants/          # Constantes
│   └── statusCodes.ts # Códigos de status
├── types/             # Tipos TypeScript
│   └── index.ts
├── App.tsx            # App principal com rotas
└── main.tsx          # Entry point
```

## 🔐 Autenticação

O sistema utiliza JWT Bearer Token:

1. Login através de `/autenticacao`
2. Token armazenado em localStorage
3. Interceptor Axios adiciona token automaticamente
4. Redirect para login se token expirar (401)

## 📊 Integração com Backend

### Endpoints Utilizados

- `POST /autenticacao` - Login
- `GET /cargas/` - Listar cargas
- `GET /cargas/{id}` - Detalhes da carga
- `POST /tracking/{invoice_id}` - Atualizar status
- `POST /cargas/xmls/upload/{invoice_id}` - Upload CTe XML

## 🎨 Componentes Principais

### Dashboard
- Tabela de cargas com refresh automático
- Campo de busca/filtro
- Ações por linha da tabela

### Modals
- **ShipmentDetailsModal**: Visualização completa da carga
- **UpdateStatusModal**: Atualização de status com filtros
- **UploadXmlModal**: Upload de XMLs com drag & drop

## 📝 Notas

- Todos os status codes estão mapeados em `constants/statusCodes.ts`
- Validações de formulário são feitas antes de enviar ao backend
- Feedback visual com mensagens de sucesso/erro
- Interface responsiva para diferentes tamanhos de tela

## 🐛 Debug

Para debugar problemas de API, verifique:
1. Backend rodando corretamente
2. URL correta no `.env`
3. Token válido no localStorage
4. Console do navegador para erros

## 📄 Licença

Este projeto é proprietário.


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
