
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

before(verificarBancoDeTestes);
after(encerrarConexao);

const idInexistente = new mongoose.Types.ObjectId().toString();

test('GET livro com ID inválido retorna 400', async () => {
  const response = await request(app)
    .get('/livros/id-invalido');

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('GET livro inexistente retorna 404', async () => {
  const response = await request(app)
    .get(`/livros/${idInexistente}`);

  assert.equal(response.status, HTTP_STATUS.NOT_FOUND);
});

test('GET autor inexistente retorna 404', async () => {
  const response = await request(app)
    .get(`/autores/${idInexistente}`);

  assert.equal(response.status, HTTP_STATUS.NOT_FOUND);
});

test('POST autor sem nome retorna 400', async () => {
  const response = await request(app)
    .post('/autores')
    .send({ nacionalidade: 'Brasileira' });

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('POST livro sem título retorna 400', async () => {
  const response = await request(app)
    .post('/livros')
    .send({
      editora: 'Editora Backend',
      preco: 50,
      paginas: 200,
      autor: idInexistente
    });

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('POST livro com páginas inválidas retorna 400', async () => {
  const response = await request(app)
    .post('/livros')
    .send({
      titulo: `Livro Inválido ${randomUUID()}`,
      editora: 'Editora Backend',
      preco: 50,
      paginas: 5,
      autor: idInexistente
    });

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('GET com página negativa retorna 400', async () => {
  const response = await request(app)
    .get('/livros?paginas=-1');

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('GET com limite zero retorna 400', async () => {
  const response = await request(app)
    .get('/livros?limite=0');

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('GET com preço mínimo zero retorna 400', async () => {
  const response = await request(app)
    .get('/livros/busca?precoMin=0');

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});

test('DELETE livro inexistente retorna 404', async () => {
  const response = await request(app)
    .delete(`/livros/${idInexistente}`);

  assert.equal(response.status, HTTP_STATUS.NOT_FOUND);
});

test('PUT autor inexistente retorna 404', async () => {
  const response = await request(app)
    .put(`/autores/${idInexistente}`)
    .send({ nome: 'Autor Inexistente' });

  assert.equal(response.status, HTTP_STATUS.NOT_FOUND);
});
