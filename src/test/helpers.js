import mongoose from 'mongoose';
import connectDataBase from '../conf/dbConecte.js';

export async function verificarBancoDeTestes() {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.includes('/Livraria_Testes')) {
    throw new Error('❌ Banco de testes não configurado!');
  }

  if (mongoose.connection.readyState !== 1) {
    await connectDataBase();
  }

  if (mongoose.connection.name !== 'Livraria_Testes') {
    throw new Error('❌ Conexão fora do banco de testes!');
  }
}

export async function encerrarConexao() {
  await mongoose.disconnect();
}