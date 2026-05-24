<div align="center">

# 🥔 ProjetoBatata — Plano de Tarefas

### E-Commerce de Legumes · Django + React

</div>

---

> **Legenda de estado:**
> ⬜ Por fazer &nbsp;│&nbsp; 🔄 Em progresso &nbsp;│&nbsp; ✅ Concluído

---

## 🏗️ Fase 1 — Arquitetura e Modelação de Dados

> *Backend · Django*

A estruturação do modelo relacional dita o sucesso de um e-commerce. Esta fase foca-se em criar a base do sistema.

| # | Tarefa | Descrição | Estado |
|:-:|--------|-----------|:------:|
| 1.1 | **Configuração do Projeto Django** | Criar o projeto base, configurar a BD (SQLite por defeito) e preparar as apps (`core`, `users`, `store`). | ✅ |
| 1.2 | **Modelação de Utilizadores** | Diferenciação Cliente/Staff. Modelo nativo `User` + modelo `Profile` com `OneToOneField` para dados adicionais (morada de envio, etc.). | ✅ |
| 1.3 | **Modelação do Catálogo** | Modelos `Category` (Feijão, Grão, Ervilhas…) e `Product` (nome, descrição, preço, stock, categoria, `ImageField`). | ✅ |
| 1.4 | **Modelação de Encomendas** | Modelo `Order` (ligado ao User, estado, data) + modelo intermédio `OrderItem` (ligado à Order e ao Product, quantidade e preço na altura da compra). | ✅ |
| 1.5 | **Modelação de Avaliações e Blog** | Modelo `Review` com texto e rating (1–5), ligado ao `User` e ao `Product`. Modelo `BlogPost` para artigos. | ✅ |
| 1.6 | **Registo no Admin** | Registar todos os modelos em `admin.py` para gestão de inventário e moderação de comentários desde o primeiro dia. | ✅ |
| 1.7 | **Seed Data** | Script `seed_data.py` para popular a BD com dados realistas (utilizadores, categorias, produtos, reviews, blog). | ✅ |

---

## 🔌 Fase 2 — Desenvolvimento da API REST

> *Backend · Django REST Framework*

Exposição dos dados para o Frontend consumir.

| # | Tarefa | Descrição | Estado |
|:-:|--------|-----------|:------:|
| 2.1 | **Instalar DRF** | Instalar e configurar o Django REST Framework. | ✅ |
| 2.2 | **Criar Serializers** | Converter modelos de BD em JSON. Dados da categoria aninhados (nested) nos detalhes do produto. Validação de stock nas encomendas. | ✅ |
| 2.3 | **Criar Views/Endpoints** | Ver endpoints detalhados abaixo. | ✅ |
| 2.4 | **Configurar CORS e CSRF** | `django-cors-headers`, `CORS_ALLOW_CREDENTIALS = True`, `CSRF_TRUSTED_ORIGINS` para comunicação segura com React no porto `5173`. | ✅ |

<details>
<summary>📡 <strong>Endpoints da API (Tarefa 2.3)</strong></summary>

| Método | Endpoint | Descrição |
|:------:|----------|-----------|
| `GET` | `/api/products/` | Listagem do catálogo (filtro por categoria e pesquisa) |
| `GET` | `/api/products/<slug>/` | Detalhe do produto com reviews |
| `GET` | `/api/categories/` | Listagem de categorias |
| `POST` | `/api/orders/create/` | Submissão de encomenda *(apenas autenticados)* |
| `GET` | `/api/orders/` | Histórico de encomendas do utilizador |
| `POST` | `/api/reviews/` | Submissão de avaliação |
| `GET` | `/api/blog/` | Listagem de artigos do blog |
| `GET` | `/api/blog/<slug>/` | Detalhe do artigo |
| `POST` | `/api/auth/login/` | Login (sessão) |
| `POST` | `/api/auth/register/` | Registo |
| `POST` | `/api/auth/logout/` | Logout |
| `GET` | `/api/auth/user/` | Utilizador atual |
| `PUT` | `/api/auth/profile/` | Atualizar perfil |

</details>

---

## 🔐 Fase 3 — Autenticação e Gestão de Sessões

> *Full-Stack · Django + React*

Garantir a segurança e os diferentes níveis de acesso: **Visitante** → **Cliente** → **Staff**.

| # | Tarefa | Descrição | Estado |
|:-:|--------|-----------|:------:|
| 3.1 | **Endpoints de Autenticação** | Views Django para Login (`authenticate` + `login`), Registo (Signup) e Logout. Autenticação baseada em sessões/cookies. | ✅ |
| 3.2 | **Contexto de Utilizador (React)** | `UserProvider` com `useContext()` para estado global do utilizador logado. Navbar dinâmica ("Perfil" vs "Entrar"). | ✅ |
| 3.3 | **Proteção de Rotas (React)** | Componente `ProtectedRoute` — Checkout e Perfil só acessíveis se `user != null`. | ✅ |

---

## 🎨 Fase 4 — Estrutura e Interface do Frontend

> *Frontend · React (SPA)*

Criação da interface de utilizador — Single Page Application.

| # | Tarefa | Descrição | Estado |
|:-:|--------|-----------|:------:|
| 4.1 | **Inicialização via Vite** | Criar o projeto React com Vite + `@vitejs/plugin-react`. | ✅ |
| 4.2 | **Roteamento (React Router)** | Definir as `Routes` principais em `App.jsx`. Ver rotas abaixo. | ✅ |
| 4.3 | **Componentes UI** | `Navbar`, `Footer`, `ProductCard`, `ProtectedRoute`. | ✅ |
| 4.4 | **Páginas Completas** | `HomePage`, `ProductDetailPage`, `CartPage`, `CheckoutPage`, `LoginPage`, `RegisterPage`, `ProfilePage`, `BlogPage`, `BlogDetailPage`. | ✅ |
| 4.5 | **Design System** | CSS global com design tokens (paleta verde escura), Google Fonts (Inter + Outfit), dark theme premium, responsivo. | ✅ |

<details>
<summary>🗺️ <strong>Mapa de Rotas (Tarefa 4.2)</strong></summary>

| Rota | Página |
|------|--------|
| `/` | Homepage — Hero, Pesquisa, Filtro por Categoria, Grid de Produtos |
| `/product/:slug` | Ficha técnica do legume + Reviews + Formulário de avaliação |
| `/blog` | Listagem de artigos do blog |
| `/blog/:slug` | Detalhe do artigo |
| `/cart` | Carrinho de compras com resumo |
| `/checkout` | Finalização da encomenda *(protegida)* |
| `/login` | Página de login |
| `/register` | Página de registo |
| `/profile` | Perfil + Histórico de encomendas *(protegida)* |

</details>

---

## ⚡ Fase 5 — Lógica de Negócio e Integração

> *Frontend · React + Axios*

Dar vida à interface conectando-a à API.

| # | Tarefa | Descrição | Estado |
|:-:|--------|-----------|:------:|
| 5.1 | **Serviço API (axios)** | `services/api.js` centralizado com interceptor CSRF e todas as funções de chamada à API. | ✅ |
| 5.2 | **Fetch do Catálogo** | `useEffect` + axios na HomePage com filtro por categoria e pesquisa. | ✅ |
| 5.3 | **Gestão do Carrinho** | `CartContext` com `localStorage` para adicionar, remover, alterar quantidades e persistir entre sessões. | ✅ |
| 5.4 | **Processo de Checkout** | `POST` com itens do carrinho + dados de envio → API Django cria encomenda → limpar carrinho após sucesso. | ✅ |
| 5.5 | **Submissão de Reviews** | Formulário na página do produto com rating e comentário via `POST`. | ✅ |
| 5.6 | **Blog** | Listagem e detalhe de artigos com parsing básico de formatação. | ✅ |
| 5.7 | **Perfil e Encomendas** | Dados editáveis + histórico de encomendas com estados coloridos. | ✅ |

---

## 📦 Bibliotecas e Ferramentas

### Backend

| Biblioteca | Descrição |
|------------|-----------|
| 🐍 **Django 5.x** | Framework backend — ORM e gestão de dados. |
| 🔗 **djangorestframework** | Criação de APIs RESTful (serializers, views, permissions). |
| 🌐 **django-cors-headers** | Permite que o Vite/React (`localhost:5173`) faça pedidos à API (`localhost:8000`). |
| 🖼️ **Pillow** | Suporte a `ImageField` para imagens de produtos e blog. |

### Frontend

| Biblioteca | Descrição |
|------------|-----------|
| ⚛️ **React 19 (via Vite)** | Criação do frontend SPA. |
| ⚙️ **@vitejs/plugin-react** | Plugin Vite para suporte a JSX e Fast Refresh. |
| 🧭 **react-router-dom** | Navegação entre páginas sem recarregar o browser. |
| 📡 **axios** | Pedidos HTTP com interceptors para CSRF. |
| 🔔 **react-toastify** | Feedback visual — notificações de sucesso/erro. |
| ✨ **react-icons** | Ícones vetoriais (carrinho, estrelas, perfil, etc.). |

---

<div align="center">

> 📅 *Última atualização: 22 de maio de 2026*

</div>