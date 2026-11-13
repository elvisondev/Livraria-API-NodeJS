# 📚 Livraria API — Node.js

API REST desenvolvida com **Node.js, Express, MongoDB e Mongoose** para gerenciamento de livros e autores.

Projeto desenvolvido durante os estudos de desenvolvimento back-end na **Alura**, com implementações adicionais para praticar operações CRUD, consultas dinâmicas e tratamento de respostas HTTP.

## 🚀 Tecnologias

- Node.js
- JavaScript (ES Modules)
- Express
- MongoDB Atlas
- Mongoose

## ⚙️ Funcionalidades

- Cadastro e listagem de livros e autores.
- Consulta de livros e autores por ID.
- Atualização e exclusão de registros.
- Busca de livros por título e editora.
- Pesquisas parciais sem diferenciação entre letras maiúsculas e minúsculas.
- Armazenamento de informações de autores nos documentos dos livros.
- Tratamento de erros e códigos de status HTTP.
- Configuração de conexão com o banco por variáveis de ambiente.

## 🔗 Endpoints

### Livros

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/livros` | Listar todos os livros |
| GET | `/livros/:id` | Buscar livro por ID |
| GET | `/livros/busca` | Buscar livros por editora |
| GET | `/livros/busca/titulo` | Buscar livros por título |
| POST | `/livros` | Cadastrar livros |
| PUT | `/livros/:id` | Atualizar livro |
| DELETE | `/livros/:id` | Excluir livro |

### Autores

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/autores` | Listar autores |
| GET | `/autores/:id` | Buscar autor por ID |
| POST | `/autores` | Cadastrar autor |
| PUT | `/autores/:id` | Atualizar autor |
| DELETE | `/autores/:id` | Excluir autor |

## 🔎 Exemplos de busca

**Buscar livros por título:**

`GET /livros/busca/titulo?titulo=Harry`

**Buscar livros por editora:**

`GET /livros/busca?editora=Rocco`

As consultas utilizam expressões regulares do MongoDB para permitir buscas parciais, ignorando diferenças entre letras maiúsculas e minúsculas.

## 🛠️ Instalação

Clone o repositório:

```bash
git clone https://github.com/SEU-USUARIO/Livraria-API-NodeJS.git
```

Entre na pasta do projeto e instale as dependências:

```bash
cd Livraria-API-NodeJS
npm install
```

Crie um arquivo `.env` com base no `.env.example` e configure sua conexão com o MongoDB Atlas.

Depois, execute a aplicação utilizando o script de inicialização definido no `package.json`.

## 📌 Objetivo

Consolidar conhecimentos de desenvolvimento back-end com Node.js, incluindo arquitetura de APIs REST, roteamento com Express, persistência de dados com MongoDB e organização de controladores e modelos.

---

**Desenvolvido por [Elvison](https://github.com/elvisondev) — Projeto de estudos | Alura**