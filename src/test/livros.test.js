import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';

import { verificarBancoDeTestes } from './helpers.js';
import app from '../app.js';
import { HTTP_STATUS } from '../conf/http.js';

// Executa antes dos testes
before(verificarBancoDeTestes);

// Teus testes ficam aqui
test('GET /livros deve retornar 200', async () => {
  const response = await request(app).get('/livros');

  assert.equal(response.status, HTTP_STATUS.OK);
  assert.ok(Array.isArray(response.body));
});

test('GET /livros com paginação inválida deve retornar 400', async () => {
  const response = await request(app).get('/livros?paginas=-1');

  assert.equal(response.status, HTTP_STATUS.BAD_REQUEST);
});


// Executa depois dos testes
after(async () => {
  console.log('Banco utilizado:', mongoose.connection.name);
  await mongoose.disconnect();
});
