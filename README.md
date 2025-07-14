# ShopNow - E-commerce de Roupas

## 📋 Descrição
ShopNow é uma aplicação web de e-commerce completa para loja de roupas, desenvolvida com HTML, CSS, JavaScript e Firebase. O projeto oferece funcionalidades completas de cadastro de produtos, autenticação de usuários e gerenciamento de perfil.

## 🚀 Funcionalidades

### 🏠 Página Inicial
- Banner de boas-vindas moderno
- Barra de navegação responsiva
- Campo de pesquisa de produtos
- Filtros por categoria (Camisas, Tênis, Acessórios)
- Listagem dinâmica de produtos do Firebase
- Design responsivo e atrativo

### 🛒 Gerenciamento de Produtos
- **Cadastro**: Formulário completo com validação
- **Consulta**: Listagem em tabela com busca por ID/nome
- **Atualização**: Edição inline de produtos existentes
- **Exclusão**: Remoção com confirmação
- Campos: ID único, Nome, Categoria, Quantidade, Valor, Descrição

### 👤 Sistema de Usuários
- **Cadastro de Cliente**: Formulário completo com dados pessoais e endereço
- **Login**: Autenticação via Google ou email/senha
- **Perfil**: Visualização e edição de dados pessoais
- **Proteção de Rotas**: Acesso restrito a áreas autenticadas

### 🔧 Tecnologias Utilizadas
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Firebase Realtime Database
- **Autenticação**: Firebase Authentication
- **Hospedagem**: Preparado para Firebase Hosting
- **Design**: CSS Grid, Flexbox, Responsivo

## 📁 Estrutura do Projeto

```
shopnow/
├── index.html              # Página inicial
├── login.html              # Página de login
├── cadastro-cliente.html   # Cadastro de cliente
├── cadastro-produto.html   # Cadastro de produto
├── perfil.html             # Perfil do usuário
├── css/
│   └── style.css           # Estilos principais
├── js/
│   ├── firebase-config.js  # Configuração Firebase
│   ├── script.js           # Script da página inicial
│   ├── auth.js             # Autenticação
│   ├── customer.js         # Gerenciamento de clientes
│   ├── product.js          # Gerenciamento de produtos
│   └── profile.js          # Perfil do usuário
└── images/                 # Pasta para imagens (vazia)
```

## 🔥 Configuração Firebase

O projeto está configurado com Firebase:
- **Project ID**: portfolio-91d7b
- **Database URL**: https://portfolio-91d7b-default-rtdb.firebaseio.com
- **Auth Domain**: portfolio-91d7b.firebaseapp.com

### Estrutura do Banco de Dados
```
firebase-database/
├── products/
│   └── {productId}/
│       ├── id: string
│       ├── productName: string
│       ├── category: string
│       ├── quantity: number
│       ├── price: number
│       ├── description: string
│       ├── createdAt: string
│       └── updatedAt: string
└── customers/
    └── {userId}/
        ├── uid: string
        ├── fullName: string
        ├── email: string
        ├── photoURL: string
        ├── city: string
        ├── phone: string
        ├── street: string
        ├── number: string
        ├── neighborhood: string
        ├── state: string
        ├── cep: string
        ├── createdAt: string
        └── provider: string
```

## 🖥️ Como Executar Localmente

1. **Navegue até a pasta do projeto:**
   ```bash
   cd shopnow
   ```

2. **Inicie um servidor HTTP local:**
   ```bash
   python3 -m http.server 8000
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:8000
   ```

## 🎨 Design e Interface

### Paleta de Cores
- **Primária**: Azul (#3498db)
- **Secundária**: Cinza escuro (#2c3e50)
- **Destaque**: Vermelho (#e74c3c)
- **Fundo**: Cinza claro (#f8f9fa)

### Características do Design
- Interface moderna e clean
- Gradientes e sombras suaves
- Animações e transições CSS
- Ícones Font Awesome
- Layout responsivo para mobile

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- **Desktop**: Layout completo com sidebar
- **Tablet**: Layout adaptado com navegação colapsável
- **Mobile**: Menu hamburger e layout vertical

## 🔐 Segurança

- Autenticação Firebase integrada
- Validação de formulários client-side
- Proteção de rotas sensíveis
- Sanitização de dados de entrada

## 🧪 Testes Realizados

✅ Cadastro de produtos com sucesso
✅ Listagem dinâmica funcionando
✅ Navegação entre páginas
✅ Formulários com validação
✅ Interface responsiva
✅ Integração Firebase operacional

## 📈 Próximos Passos (Opcionais)

- [ ] Implementar carrinho de compras
- [ ] Sistema de favoritos
- [ ] Filtros avançados (preço, tamanho)
- [ ] Paginação de produtos
- [ ] Upload de imagens de produtos
- [ ] Sistema de avaliações
- [ ] Checkout e pagamentos

## 🚀 Deploy

Para fazer deploy do projeto:

1. **Firebase Hosting:**
   ```bash
   firebase init hosting
   firebase deploy
   ```

2. **Netlify:**
   - Conecte o repositório
   - Configure build: `npm run build`
   - Pasta de publicação: `dist/`

3. **Vercel:**
   ```bash
   vercel --prod
   ```

## 📞 Suporte

Para dúvidas ou suporte:
- Email: contato@shopnow.com
- Telefone: (11) 99999-9999

---

**Desenvolvido com ❤️ usando HTML, CSS, JavaScript e Firebase**

