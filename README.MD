# 📚 Livraria API — Node.js

API REST para gerenciamento de **livros e autores**, desenvolvida com **Node.js, Express, MongoDB Atlas e Mongoose** durante a formação back-end da **Alura** e ampliada com filtros, paginação, relacionamento entre coleções, tratamento de erros e testes automatizados.

O foco deste repositório é o **back-end**. Há também um painel administrativo em React e TypeScript para demonstrar o consumo dos endpoints.

**Repositórios:** [API (este projeto)](https://github.com/elvisondev/Livraria-API-NodeJS) · [Painel administrativo — Front-end](https://github.com/elvisondev/Livraria-Admin-Frontend)

## 🚀 Tecnologias

- **Node.js** e JavaScript com ES Modules
- **Express** — servidor HTTP e rotas REST
- **MongoDB Atlas** — banco de dados NoSQL
- **Mongoose** — schemas, validações e consultas
- **mongoose-autopopulate** — preenchimento automático de referências de autores
- **Node.js Test Runner (`node:test`)**, `node:assert` e **Supertest** — testes automatizados da API
- **Postman** — testes manuais de requisições HTTP
- **ESLint** e **Prettier** — qualidade e formatação do código

## ⚙️ Funcionalidades implementadas

- CRUD de **livros** e **autores**.
- Consulta de recursos por identificador MongoDB (`ObjectId`).
- Filtros combináveis de livros por **título, editora, nome do autor e faixa de preço**.
- Busca parcial e sem diferenciação entre maiúsculas e minúsculas para título, editora e nome do autor, utilizando `$regex`.
- Paginação e ordenação por parâmetros de consulta, com middleware compartilhado.
- Referenciamento de autores nos livros e uso de `mongoose-autopopulate` nas listagens.
- Consulta individual de livro com os dados do autor via `populate()`.
- Cadastro com validações do schema e verificação de duplicidade de título ou nome de autor.
- Tratamento centralizado de erros HTTP.
- Testes automatizados usando banco de dados separado, com proteção contra execução no banco principal.
- Campo **editora de texto livre**, sem uma lista fixa de valores permitidos.

## 🔗 Endpoints

### Livros

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/livros` | Lista livros; aceita paginação e ordenação |
| `GET` | `/livros/busca` | Pesquisa livros por filtros combináveis |
| `GET` | `/livros/:id` | Consulta um livro pelo ID |
| `POST` | `/livros` | Cadastra um livro |
| `PUT` | `/livros/:id` | Atualiza um livro |
| `DELETE` | `/livros/:id` | Exclui um livro |

### Autores

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/autores` | Lista autores; aceita paginação e ordenação |
| `GET` | `/autores/:id` | Consulta um autor pelo ID |
| `POST` | `/autores` | Cadastra um autor |
| `PUT` | `/autores/:id` | Atualiza um autor |
| `DELETE` | `/autores/:id` | Exclui um autor |

> A busca unificada de livros utiliza **`/livros/busca`**. Não existe necessidade de consultar rotas antigas como `/livros/busca/titulo`.

## 🔎 Busca avançada de livros

Todos os parâmetros abaixo são opcionais e podem ser combinados:

| Parâmetro | Descrição | Exemplo |
| --- | --- | --- |
| `titulo` | Pesquisa parcial pelo título | `titulo=Harry` |
| `editora` | Pesquisa parcial pela editora | `editora=Rocco` |
| `autores` | Pesquisa parcial pelo nome do autor | `autores=Robert` |
| `precoMin` | Limite inferior de preço, inclusivo | `precoMin=30` |
| `precoMax` | Limite superior de preço, inclusivo | `precoMax=150` |

```http
GET /livros/busca?titulo=Harry
GET /livros/busca?editora=Rocco
GET /livros/busca?autores=Robert
GET /livros/busca?precoMin=30&precoMax=150
GET /livros/busca?autores=Robert&precoMax=100
```

A busca pelo autor primeiro localiza um registro pelo nome e depois procura livros vinculados ao seu `_id`. Para manter compatibilidade com registros de formatos anteriores, a consulta utiliza `$or` para aceitar tanto referências `ObjectId` diretas quanto documentos com `autor._id`. Os filtros por preço utilizam `$gte` e `$lte`.

Uma busca sem resultados pode retornar **`200 OK`** com o array vazio `[]`.

## 📄 Paginação e ordenação

As rotas de listagem utilizam um middleware compartilhado:

| Parâmetro | Padrão | Exemplo |
| --- | --- | --- |
| `limite` | `5` | `limite=10` |
| `paginas` | `1` | `paginas=2` |
| `ordenacao` | `_id:-1` | `ordenacao=preco:1` |

Em `ordenacao=campo:direcao`, o valor `1` representa ordem crescente e `-1` ordem decrescente.

```http
GET /livros?limite=10&paginas=2
GET /livros?ordenacao=titulo:1
GET /livros/busca?precoMin=30&ordenacao=preco:1
GET /autores?ordenacao=nome:1&limite=10
```

**Formato da resposta:** as listagens retornam diretamente um **array JSON**, sem um campo de total de registros ou quantidade total de páginas.

## 📚 Relacionamento entre livros e autores

O modelo de livros usa uma referência ao modelo de autores (`ref: 'autores'`). O plugin `mongoose-autopopulate` preenche automaticamente o **nome** do autor nas consultas de listagem, além do identificador da referência.

Na consulta individual (`GET /livros/:id`), a aplicação desativa a autopopulação padrão e utiliza `populate('autor')` para obter os dados disponíveis do autor, como nacionalidade.

O código de busca por autores também contempla registros históricos em que o autor foi armazenado como objeto incorporado. Essa compatibilidade não substitui uma futura padronização dos dados existentes.

## 🧾 Exemplos de cadastro

**Cadastrar um autor:**

```http
POST /autores
Content-Type: application/json
```

```json
{
  "nome": "Gabriel Monteiro",
  "nacionalidade": "Brasileira"
}
```

**Cadastrar um livro:** após cadastrar ou consultar um autor, utilize o `_id` correspondente no campo `autor`.

```http
POST /livros
Content-Type: application/json
```

```json
{
  "titulo": "Engenharia de Software na Prática",
  "editora": "Editora Tecnologia",
  "preco": 79.90,
  "paginas": 384,
  "autor": "COLOQUE_AQUI_O_OBJECTID_DO_AUTOR"
}
```

O título, a editora e o autor são obrigatórios no modelo de livros. Para `paginas`, a validação do schema aceita valores de **10 a 1000** quando o campo é informado.

## 🛡️ Tratamento de erros e respostas HTTP

| Código | Significado | Exemplo |
| --- | --- | --- |
| `200` | OK | Consultas e operações de atualização/exclusão bem-sucedidas |
| `201` | Created | Cadastro de livro ou autor |
| `400` | Bad Request | ID inválido, parâmetros de paginação inválidos ou falha de validação |
| `404` | Not Found | Livro ou autor não encontrado |
| `409` | Conflict | Tentativa de cadastrar título ou nome de autor já existente |
| `500` | Internal Server Error | Falha inesperada |

Os controllers utilizam `message` nas respostas de sucesso. **Na versão do `ErroBase.js` consultada para este README, a resposta centralizada de erro ainda utiliza a chave `mesagem` (grafia legada) e `status`.** Caso essa correção já esteja aplicada localmente, publique-a para padronizar as respostas como `{ "message": "...", "status": 400 }`.

## 🧪 Testes automatizados

A suíte utiliza **Node.js Test Runner** e **Supertest** para verificar respostas HTTP, filtros, cadastro e tratamento de erros. A última execução compartilhada durante o desenvolvimento apresentou **21 testes aprovados e nenhuma falha**.

Arquivos de teste:

```text
src/test/
├── autores.test.js
├── erros.test.js
├── filtros.test.js
├── livros.test.js
└── helpers.js
```

A suíte contempla, entre outros cenários:

- CRUD de autores e tentativa de cadastro duplicado (`409`).
- Listagem de livros e parâmetros de paginação inválidos (`200`/`400`).
- Pesquisa por título, editora, autor e faixa de preço.
- Ordenação e paginação de resultados.
- Identificadores inválidos, recursos inexistentes e campos obrigatórios ausentes (`400`/`404`).

> **Cobertura atual:** os testes de livros são principalmente de listagem; ainda não há uma suíte completa de criação, atualização e exclusão de livros com verificação de persistência. A aprovação dos testes existentes não implica cobertura de 100% dos comportamentos da API.

### Banco exclusivo para testes

Crie um banco separado, por exemplo `Livraria_Testes`, e um arquivo `.env.test` na raiz:

```dotenv
MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/Livraria_Testes
PORT=3001
```

O `helpers.js` verifica o nome do banco e evita a execução prevista dos testes fora de `Livraria_Testes`. Os testes criam e removem apenas os registros de que precisam. **Nunca use a URI do banco principal para testes que escrevem ou excluem dados.**

Para executar todos os arquivos `*.test.js` **uma vez**, sequencialmente, e encerrar a conexão ao final:

```bash
npm test
```

Script configurado:

```json
"test": "node --env-file=.env.test --test --test-concurrency=1 src/test/*.test.js"
```

O arquivo `helpers.js` não é executado como arquivo de teste independente.

## 🛠️ Instalação e execução local

### 1. Clone o projeto

```bash
git clone https://github.com/elvisondev/Livraria-API-NodeJS.git
cd Livraria-API-NodeJS
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

Crie `.env` na raiz do projeto:

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://USUARIO:SENHA@CLUSTER.mongodb.net/Livraria
```

Use a URI e as credenciais do seu cluster MongoDB Atlas. O nome do banco é sensível a maiúsculas e minúsculas. **Não envie o `.env` ou o `.env.test` ao GitHub.**

### 4. Inicie a API

```bash
npm run dev
```

Para reiniciar o servidor automaticamente ao modificar os arquivos:

```bash
npm run dev:watch
```

Por padrão, com `PORT=3000`, a API ficará disponível em `http://localhost:3000`. Um teste simples é abrir `http://localhost:3000/livros` ou enviar a requisição pelo Postman.

Outros scripts úteis: `npm run lint`, `npm run lint:fix` e `npm run format`.

## 🖥️ Interface administrativa — React + TypeScript

O projeto possui um **front-end complementar**, em um repositório independente:

**➡️ [Livraria Admin Front-end](https://github.com/elvisondev/Livraria-Admin-Frontend)**

Tecnologias: **React, TypeScript, Vite e Tailwind CSS**.

O painel permite gerenciar e consultar livros e autores por meio desta API, utilizando dados reais do MongoDB, com dashboard, formulários, filtros e uma interface Dark Tech responsiva.

Para testar a aplicação completa, execute a API e, em outro terminal, siga as instruções do README do front-end. Em desenvolvimento, o Vite pode encaminhar as requisições para a API por meio de seu proxy, sem necessidade de CORS entre essas duas origens locais.

**Escopo e autoria:** este repositório documenta o desenvolvimento do **back-end**, realizado como projeto de estudos. A interface administrativa foi criada com auxílio de inteligência artificial para demonstrar visualmente a utilização da API.

## 🧭 Organização do código

```text
src/
├── conf/          # Conexão com MongoDB e constantes HTTP
├── controllers/   # Regras de requisição e operações CRUD
├── error/         # Classes de erros personalizados
├── middlewares/   # Paginação, erros e tratamento de rotas inexistentes
├── models/        # Schemas e relacionamento entre coleções
├── routes/        # Rotas de livros e autores
├── test/          # Testes automatizados e auxiliares
├── app.js         # Configuração do Express e middlewares
└── server.js      # Conexão, logs e inicialização HTTP
```

## 📌 Limitações atuais e melhorias futuras

A API atende ao escopo de estudos, mas **não implementa** atualmente:

- Autenticação, autorização ou controle de acesso por usuário.
- CRUD independente de editoras: o nome da editora é armazenado diretamente no livro, como texto livre.
- Endpoint que retorne a quantidade total de registros ou páginas nas listagens.
- Bloqueio da exclusão de um autor que ainda esteja referenciado por livros. Nessa situação, a referência pode deixar de ser populada em consultas futuras.
- Validação completa das atualizações: os `PUT` utilizam `findByIdAndUpdate()` sem `runValidators: true`.
- Validação estrita de todos os campos e direções de ordenação. O middleware atual valida valores positivos de página e limite, mas não mantém uma lista de campos de ordenação permitidos.
- Configuração própria de CORS para origens distintas na publicação da API.

Esses itens são pontos de evolução e não devem ser interpretados como funcionalidades já implementadas.

## 🎯 Objetivo do projeto

Consolidar conhecimentos em **desenvolvimento back-end com Node.js**, criação de APIs REST com Express, modelagem e consultas no MongoDB, tratamento de erros, testes automatizados e integração com uma interface consumidora de API.

---

**Desenvolvido por [Elvison](https://github.com/elvisondev) · Projeto de estudos — Alura**
