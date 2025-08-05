# 🏦 Backend - Sistema de Finanças Pessoais

API REST completa para gerenciamento de finanças pessoais desenvolvida com Node.js, Express e MongoDB.

## 🚀 Funcionalidades

### 👤 **Autenticação & Usuários**
- ✅ Registro de usuários
- ✅ Login/Logout com JWT
- ✅ Gestão de perfil
- ✅ Alteração de senha
- ✅ Exclusão de conta

### 🏷️ **Categorias**
- ✅ CRUD completo de categorias
- ✅ Categorias padrão automáticas
- ✅ Validação de unicidade por usuário
- ✅ Estatísticas de uso
- ✅ Orçamentos por categoria

### 💰 **Transações**
- ✅ CRUD completo de transações
- ✅ Filtros avançados (data, categoria, tipo)
- ✅ Busca textual
- ✅ Transações recorrentes
- ✅ Anexos e localização
- ✅ Múltiplas formas de pagamento

### 🎯 **Metas Financeiras**
- ✅ Criação e acompanhamento de metas
- ✅ Marcos automáticos (25%, 50%, 75%, 100%)
- ✅ Contribuições manuais e automáticas
- ✅ Projeções de conclusão
- ✅ Relatórios de progresso

### 📊 **Insights & Analytics**
- ✅ Visão geral financeira
- ✅ Análise por categorias
- ✅ Insights automáticos
- ✅ Relatórios personalizados

## 🛠️ Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
backend/
├── config/          # Configurações
├── controllers/     # Controladores (futuramente)
├── middleware/      # Middlewares customizados
├── models/          # Modelos do banco de dados
├── routes/          # Rotas da API
├── src/            # Arquivos fonte
├── server.js       # Arquivo principal
├── package.json    # Dependências
└── README.md       # Este arquivo
```

## ⚙️ Configuração

### 1. **Instalar Dependências**
```bash
cd backend
npm install
```

### 2. **Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do backend:

```env
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/financas-pessoais
FRONTEND_URL=http://localhost:5173
JWT_SECRET=sua_chave_secreta_jwt_aqui_muito_segura
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
```

### 3. **MongoDB (Opcional)**
- **Com MongoDB local**: Instale e execute MongoDB
- **Sem MongoDB**: O sistema funciona em modo desenvolvimento

### 4. **Executar Servidor**
```bash
# Desenvolvimento (com nodemon)
npm run dev

# Produção
npm start
```

## 🌐 Endpoints da API

### **Autenticação** (`/api/auth`)
```
POST   /register     # Registrar usuário
POST   /login        # Login
GET    /me           # Dados do usuário logado
PUT    /profile      # Atualizar perfil
PUT    /password     # Alterar senha
POST   /logout       # Logout
```

### **Usuários** (`/api/users`)
```
GET    /profile      # Perfil completo
DELETE /account      # Deletar conta
```

### **Categorias** (`/api/categories`)
```
GET    /             # Listar categorias
GET    /:id          # Obter categoria
POST   /             # Criar categoria
PUT    /:id          # Atualizar categoria
DELETE /:id          # Deletar categoria
GET    /stats/overview # Estatísticas
```

### **Transações** (`/api/transactions`)
```
GET    /             # Listar transações
GET    /:id          # Obter transação
POST   /             # Criar transação
PUT    /:id          # Atualizar transação
DELETE /:id          # Deletar transação
GET    /stats/summary # Resumo financeiro
```

### **Metas** (`/api/goals`)
```
GET    /             # Listar metas
POST   /             # Criar meta
GET    /stats/overview # Estatísticas das metas
```

### **Insights** (`/api/insights`)
```
GET    /financial-overview # Visão geral com insights
```

### **Health Check**
```
GET    /api/health   # Status do servidor
```

## 🔐 Autenticação

Todas as rotas privadas requerem token JWT no header:

```javascript
headers: {
  'Authorization': 'Bearer seu_token_jwt_aqui'
}
```

## 📊 Exemplo de Uso

### **1. Registrar Usuário**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "123456",
    "phone": "(11) 99999-9999",
    "cpf": "123.456.789-00"
  }'
```

### **2. Criar Categoria**
```bash
curl -X POST http://localhost:3001/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "name": "Freelance Web",
    "description": "Projetos de desenvolvimento web",
    "type": "receita",
    "color": "#3b82f6",
    "budget": {
      "monthly": 3000
    }
  }'
```

### **3. Criar Transação**
```bash
curl -X POST http://localhost:3001/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{
    "description": "Projeto E-commerce",
    "amount": 2500,
    "type": "receita",
    "category": "ID_DA_CATEGORIA",
    "paymentMethod": "pix",
    "notes": "Projeto completo com React e Node.js"
  }'
```

## 🔒 Segurança

- ✅ **JWT** para autenticação
- ✅ **bcryptjs** para hash de senhas
- ✅ **Validação** de dados de entrada
- ✅ **CORS** configurado
- ✅ **Sanitização** de dados
- ✅ **Rate limiting** (futuro)

## 📈 Performance

- ✅ **Índices** no MongoDB para consultas otimizadas
- ✅ **Paginação** nas listagens
- ✅ **Populate seletivo** para reduzir dados
- ✅ **Agregações** para estatísticas

## 🐛 Logs & Debug

O servidor registra todas as requisições e erros:

```bash
2025-01-03T21:10:00.000Z - POST /api/auth/login
✅ Conectado ao MongoDB
🚀 Servidor rodando na porta 3001
```

## 🚧 Roadmap

### **Próximas Funcionalidades**
- [ ] Upload de arquivos/anexos
- [ ] Notificações push
- [ ] Importação de extratos bancários
- [ ] API de bancos (Open Banking)
- [ ] Relatórios em PDF
- [ ] Dashboard analytics avançado
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] Testes unitários
- [ ] Docker

### **Melhorias de Performance**
- [ ] Otimização de consultas
- [ ] Cache de dados frequentes
- [ ] Compressão de responses
- [ ] CDN para assets

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 🆘 Suporte

- **Logs**: Verifique os logs do servidor para debug
- **MongoDB**: Certifique-se que está rodando na porta 27017
- **CORS**: Verifique se o frontend está na URL correta
- **JWT**: Tokens expiram em 7 dias por padrão

**🎉 Backend pronto para produção!**