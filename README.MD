# 📚 Livraria API — Node.js

API REST para gerenciamento de **livros e autores**, desenvolvida com **Node.js, Express, MongoDB Atlas e Mongoose** durante a formação back-end da **Alura**, com melhorias realizadas ao longo dos estudos.

O projeto exercita CRUD, relacionamentos entre coleções, validações, tratamento de erros, buscas flexíveis, ordenação e paginação.

> **Nota sobre versões:** os exemplos de filtros, paginação e autopopulate abaixo descrevem a versão local mais recente discutida durante o desenvolvimento. No momento desta revisão, o código publicado no GitHub ainda contém uma implementação anterior dessas funcionalidades. Publique as alterações locais antes de considerar todos os exemplos disponíveis na branch `main`.

## 🚀 Tecnologias

- Node.js e JavaScript (ES Modules)
- Express
- MongoDB Atlas
- Mongoose
- `mongoose-autopopulate` (na versão local mais recente)
- Postman para testes manuais

## ⚙️ Funcionalidades

- CRUD de livros e autores.
- Consultas por identificador (`ObjectId`).
- Filtros combináveis de **título, editora, autor e faixa de preço**.
- Busca textual parcial, sem diferenciação entre maiúsculas e minúsculas, com `$regex`.
- Paginação e ordenação dinâmica por parâmetros da URL.
- Middleware de paginação reutilizado nas listagens.
- Relacionamento entre livros e autores via Mongoose, com configuração de `autopopulate`.
- Tratamento centralizado de erros e códigos HTTP.
- Configuração de ambiente para conexão ao MongoDB Atlas.

## 🔗 Endpoints

### Livros

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/livros` | Lista livros; aceita paginação e ordenação |
| `GET` | `/livros/busca` | Filtra livros por título, editora, autor e preço |
| `GET` | `/livros/:id` | Busca um livro pelo ID |
| `POST` | `/livros` | Cadastra um livro |
| `PUT` | `/livros/:id` | Atualiza um livro |
| `DELETE` | `/livros/:id` | Exclui um livro |

### Autores

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/autores` | Lista autores; aceita paginação e ordenação |
| `GET` | `/autores/:id` | Busca um autor pelo ID |
| `POST` | `/autores` | Cadastra um autor |
| `PUT` | `/autores/:id` | Atualiza um autor |
| `DELETE` | `/autores/:id` | Exclui um autor |

> **Atenção às rotas:** na versão local atual, a busca por título e por editora é feita em `/livros/busca` usando parâmetros de consulta. O README antigo mencionava `/livros/busca/titulo`, endpoint existente no código publicado anteriormente.

## 🔎 Filtros de livros

Todos os filtros são opcionais e podem ser combinados na mesma requisição:

| Parâmetro | Finalidade | Exemplo |
| --- | --- | --- |
| `titulo` | Pesquisa parcial por título | `titulo=Harry` |
| `editora` | Pesquisa parcial por editora | `editora=Rocco` |
| `autores` | Pesquisa parcial pelo nome do autor | `autores=Rowling` |
| `precoMin` | Preço mínimo, inclusive | `precoMin=50` |
| `precoMax` | Preço máximo, inclusive | `precoMax=100` |

Exemplos no Postman:

```http
GET /livros/busca?titulo=Harry
GET /livros/busca?editora=Rocco
GET /livros/busca?autores=Lucas
GET /livros/busca?autores=Rowling
GET /livros/busca?precoMin=50&precoMax=100
GET /livros/busca?autores=Robert&precoMax=100
```

O filtro de autores localiza o cadastro pelo nome e usa seu identificador para encontrar os livros associados. Os campos textuais usam expressões regulares sem diferenciação entre maiúsculas e minúsculas. Os limites de preço usam os operadores MongoDB `$gte` e `$lte`.

## 📄 Paginação e ordenação

Nas rotas de listagem, a paginação e a ordenação são aplicadas por um middleware compartilhado.

| Parâmetro | Exemplo | Padrão utilizado nos estudos |
| --- | --- | --- |
| `limite` | `limite=10` | `5` |
| `paginas` | `paginas=2` | `1` |
| `ordenacao` | `ordenacao=titulo:1` | `_id:-1` |

Na ordenação, `1` significa crescente e `-1` significa decrescente. O campo deve existir no respectivo modelo: por exemplo, `titulo` para livros e `nome` para autores.

```http
GET /livros?ordenacao=titulo:1&limite=10
GET /livros?ordenacao=preco:-1&limite=5&paginas=2
GET /livros/busca?autores=Lucas&ordenacao=titulo:1
GET /livros/busca?precoMin=30&precoMax=150&ordenacao=preco:1
GET /autores?ordenacao=nome:1&limite=10
```

> **Observação:** o middleware precisa validar limites, páginas, campos e direções de ordenação para evitar parâmetros inesperados. Os exemplos acima demonstram a interface utilizada nos estudos.

## 🔗 Relacionamento entre livros e autores

O Mongoose é utilizado para relacionar os livros aos autores. Na versão local mais recente, o plugin `mongoose-autopopulate` permite preencher dados do autor automaticamente em consultas de livros.

A configuração estudada permite retornar normalmente apenas o identificador e o **nome** do autor em listagens, enquanto uma consulta por livro específico pode desativar a autopopulação padrão e solicitar mais campos via `populate('autor')`.

O middleware de paginação fica responsável apenas por **ordenação, deslocamento e limite**; a escolha de quais relacionamentos popular é responsabilidade do modelo ou da consulta específica.

## 🛡️ Validação e tratamento de erros

A API possui validações para dados obrigatórios e regras de negócio, além de tratamento de exceções usando middlewares e respostas JSON.

| HTTP | Significado | Exemplo de uso |
| --- | --- | --- |
| `200` | Sucesso | Consulta concluída, inclusive lista vazia `[]` |
| `201` | Criado | Livro ou autor cadastrado |
| `400` | Requisição inválida | Parâmetro incorreto ou validação rejeitada |
| `404` | Não encontrado | Recurso específico por ID inexistente |
| `409` | Conflito | Cadastro duplicado, quando aplicável |
| `500` | Erro interno | Falha inesperada no servidor |

Em buscas por filtros, a ausência de resultados pode retornar `200 OK` com `[]`, sem ser considerada uma falha do servidor.

## 🛠️ Instalação e execução

**1. Clone o repositório:**

```bash
git clone https://github.com/elvisondev/Livraria-API-NodeJS.git
cd Livraria-API-NodeJS
```

**2. Instale as dependências:**

```bash
npm install
```

**3. Configure as variáveis de ambiente:** crie um arquivo `.env` na raiz com base no `.env.example`, sem versionar credenciais reais.

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/NOME_DO_BANCO
```

Substitua pelos dados do seu ambiente. O nome do banco na URI deve corresponder ao banco real no Atlas, inclusive quanto a maiúsculas e minúsculas.

**4. Inicie a aplicação:**

```bash
npm run dev
```

Para reiniciar automaticamente ao salvar alterações:

```bash
npm run dev:watch
```

Os scripts `dev` e `dev:watch` estão definidos no `package.json` publicado.

## 🧭 Organização do projeto

A estrutura principal utiliza:

- **Routes:** definição dos endpoints do Express.
- **Controllers:** operações CRUD e montagem dos filtros de consulta.
- **Models:** schemas, validações e relacionamento com MongoDB.
- **Middlewares:** tratamento de erros e paginação compartilhada (na versão local atual).
- **Configuração:** conexão com banco de dados e variáveis de ambiente.

## 📌 Objetivo

Consolidar conhecimentos práticos em desenvolvimento back-end, APIs REST, Express, consultas com MongoDB/Mongoose, modelagem de relacionamentos, paginação, ordenação e tratamento de erros HTTP.

---

**Desenvolvido por [Elvison](https://github.com/elvisondev) — Projeto de estudos | Alura**
