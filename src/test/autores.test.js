import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';

import app from '../app.js';
import { HTTP_STATUS } from '../conf/http.js';
import {
  verificarBancoDeTestes,
  encerrarConexao
} from './helpers.js';

after(encerrarConexao);

test('CRUD completo de autores', async () => {
  await verificarBancoDeTestes();

  const nome = `Autor Teste ${crypto.randomUUID()}`;
  let autorId;

  try {
    // CREATE
    const cadastro = await request(app)
      .post('/autores')
      .send({
        nome,
        nacionalidade: 'Brasileira'
      });

    assert.equal(cadastro.status, HTTP_STATUS.CREATED);

    autorId = cadastro.body.autor._id;

    // READ
    const consulta = await request(app)
      .get(`/autores/${autorId}`);

    assert.equal(consulta.status, HTTP_STATUS.OK);
    assert.equal(consulta.body.nome, nome);

    // CONFLICT
    const duplicado = await request(app)
      .post('/autores')
      .send({
        nome,
        nacionalidade: 'Brasileira'
      });

    assert.equal(duplicado.status, HTTP_STATUS.CONFLICT);

    // UPDATE
    const atualizacao = await request(app)
      .put(`/autores/${autorId}`)
      .send({ nacionalidade: 'Portuguesa' });

    assert.equal(atualizacao.status, HTTP_STATUS.OK);

    // CONFIRMAR UPDATE
    const atualizado = await request(app)
      .get(`/autores/${autorId}`);

    assert.equal(atualizado.body.nacionalidade, 'Portuguesa');

    // DELETE
    const exclusao = await request(app)
      .delete(`/autores/${autorId}`);

    assert.equal(exclusao.status, HTTP_STATUS.OK);
    autorId = null;

  } finally {
    if (autorId) {
      await mongoose.connection
        .collection('autores')
        .deleteOne({ _id: new mongoose.Types.ObjectId(autorId) });
    }
  }
});