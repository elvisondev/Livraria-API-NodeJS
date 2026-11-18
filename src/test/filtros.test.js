
import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import request from 'supertest';

import app from '../app.js';
import { HTTP_STATUS } from '../conf/http.js';
import {
  verificarBancoDeTestes,
  encerrarConexao
} from './helpers.js';

const prefixo = `Filtro-${randomUUID()}`;
const idsLivros = [];
let autorId;

before(async () => {
  await verificarBancoDeTestes();

  const autores = mongoose.connection.collection('autores');
  const livros = mongoose.connection.collection('livros');

  const autorCriado = await autores.insertOne({
    nome: `${prefixo}-Autor`,
    nacionalidade: 'Brasileira'
  });

  autorId = autorCriado.insertedId;

  const resultado = await livros.insertMany([
    {
      titulo: `${prefixo}-Node`,
      editora: 'Editora Backend',
      preco: 30,
      paginas: 150,
      autor: autorId
    },
    {
      titulo: `${prefixo}-Express`,
      editora: 'Editora Tecnologia',
      preco: 90,
      paginas: 350,
      autor: autorId
    }
  ]);

  idsLivros.push(...Object.values(resultado.insertedIds));
});

after(async () => {
  try {
    if (mongoose.connection.name === 'Livraria_Testes') {
      await mongoose.connection.collection('livros')
        .deleteMany({ _id: { $in: idsLivros } });

      if (autorId) {
        await mongoose.connection.collection('autores')
          .deleteOne({ _id: autorId });
      }
    }
  } finally {
    await encerrarConexao();
  }
});

test('Filtrar livros por título', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({ titulo: `${prefixo}-Node` });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].preco, 30);
});

test('Filtrar livros por editora', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      titulo: prefixo,
      editora: 'Editora Tecnologia'
    });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 1);
});

test('Filtrar livros por preço mínimo', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      titulo: prefixo,
      precoMin: 50
    });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].preco, 90);
});

test('Filtrar livros por faixa de preço', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      titulo: prefixo,
      precoMin: 20,
      precoMax: 50
    });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].preco, 30);
});

test('Ordenar livros por menor preço', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      titulo: prefixo,
      ordenacao: 'preco:1'
    });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 2);
  assert.deepEqual(
    response.body.map((livro) => livro.preco),
    [30, 90]
  );
});

test('Paginar livros com limite 1', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      titulo: prefixo,
      limite: 1,
      paginas: 1
    });

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.equal(response.body.length, 1);
});

test('Filtrar livros pelo nome do autor', async () => {
  const response = await request(app)
    .get('/livros/busca')
    .query({
      autores: `${prefixo}-Autor`
    });

  assert.equal(response.status, HTTP_STATUS.OK);

  const encontrados = response.body.filter((livro) =>
    idsLivros.some((id) => String(id) === livro._id)
  );

  assert.equal(encontrados.length, 2);
});
