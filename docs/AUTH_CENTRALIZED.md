# Autenticação Centralizada - SBF Integrações

## Visão Geral

A autenticação é centralizada através da API Nike. Os usuários fazem login uma única vez e o token JWT é válido para todas as integrações.

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│                   (SBF Integrações)                             │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 1. POST /autenticacao
                      │    {usuario, senha}
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NIKE API                                      │
│              (Auth Provider)                                     │
│                                                                  │
│   - Valida credenciais                                          │
│   - Gera JWT token (HS256)                                      │
│   - Retorna access_key + expire_at                              │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      │ 2. JWT Token armazenado no localStorage
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│   Token usado para todas as requisições                         │
│   Authorization: Bearer <token>                                 │
└──────────┬─────────────────────────────────┬────────────────────┘
           │                                 │
           │ GET /cargas/                    │ GET /api/v2/shipments/
           ▼                                 ▼
┌──────────────────────┐          ┌──────────────────────┐
│     NIKE API         │          │   CENTAURO API       │
│                      │          │                      │
│ Valida JWT com       │          │ Valida JWT com       │
│ SECRET_KEY própria   │          │ MESMA SECRET_KEY     │
└──────────────────────┘          └──────────────────────┘
```

## Configuração Necessária

### 1. Variáveis de Ambiente Compartilhadas

Ambas as APIs (Nike e Centauro) DEVEM usar a mesma chave secreta para JWT:

```env
# Usar o MESMO valor em ambos os backends
SECRET_KEY=sua-chave-secreta-compartilhada-muito-segura

# Algoritmo (deve ser o mesmo)
ALGORITHM=HS256
# ou
JWT_ALGORITHM=HS256
```

### 2. Nike API (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/nike_db

# JWT (Chave que será usada para gerar tokens)
SECRET_KEY=sua-chave-secreta-compartilhada-muito-segura
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

### 3. Centauro API (.env)

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/centauro_db

# JWT (MESMA chave da Nike para validar tokens)
SECRET_KEY=sua-chave-secreta-compartilhada-muito-segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

### 4. Frontend (.env)

```env
# Nike API (Auth provider)
VITE_API_URL=http://localhost:8000
VITE_NIKE_API_URL=http://localhost:8000

# Centauro API (usa token da Nike)
VITE_CENTAURO_API_URL=http://localhost:8001
```

## Fluxo de Autenticação

1. **Usuário faz login** no frontend
2. **Frontend envia credenciais** para Nike API (`POST /autenticacao`)
3. **Nike API valida** usuário/senha no banco de dados
4. **Nike API gera JWT** assinado com `SECRET_KEY`
5. **Frontend armazena** o token no `localStorage`
6. **Todas as requisições** incluem o header `Authorization: Bearer <token>`
7. **Nike API valida** o token usando sua `SECRET_KEY`
8. **Centauro API valida** o token usando a MESMA `SECRET_KEY`

## Segurança

### ⚠️ Importante

- A `SECRET_KEY` NUNCA deve ser exposta no frontend
- Use uma chave forte (mínimo 32 caracteres aleatórios)
- Em produção, use variáveis de ambiente ou secrets manager
- Considere usar rotação de chaves

### Gerando uma SECRET_KEY Segura

```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -base64 32
```

## Validação do Token na Centauro

A Centauro API valida o token da seguinte forma:

```python
# app/core/security.py (Centauro)

def decode_access_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT access token from Nike."""
    try:
        payload = jwt.decode(
            token, 
            settings.secret_key,  # MESMA chave da Nike
            algorithms=[settings.algorithm]
        )
        return payload
    except InvalidTokenError:
        return None
```

## Troubleshooting

### Token inválido na Centauro

1. Verifique se `SECRET_KEY` é idêntica em ambos os backends
2. Verifique se `ALGORITHM` é o mesmo (HS256)
3. Verifique se o token não expirou

### 401 Unauthorized

1. Verifique se o header `Authorization` está sendo enviado
2. Verifique o formato: `Bearer <token>` (com espaço)
3. Faça login novamente para obter um novo token

## Adicionando Nova Integração

Para adicionar uma nova integração (ex: Adidas):

1. Configure a nova API para usar a MESMA `SECRET_KEY`
2. Adicione a configuração no frontend (`src/config/integrations.ts`)
3. Crie os componentes de dashboard correspondentes
