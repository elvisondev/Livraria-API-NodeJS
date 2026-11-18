import mongoose from 'mongoose';
import app from './app.js';
import connectDataBase from './conf/dbConecte.js';

const PORT = process.env.PORT || 3000;
const conexao = mongoose.connection;

// Eventos do MongoDB
conexao.once('open', () => {
  console.log('✅ MongoDB conectado com sucesso!');
});

conexao.on('error', (erro) => {
  console.error('❌ Erro na conexão MongoDB:', erro.message);
});

conexao.on('disconnected', () => {
  console.warn('⚠️ MongoDB desconectado!');
});

// Inicialização da aplicação
try {
  await connectDataBase();

  app.listen(PORT, () => {
    console.log(`🚀 API Livraria online em http://localhost:${PORT}`);
    console.log(`📚 Banco de dados: ${conexao.name}`);
    console.log(`🟢 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  });
} catch (erro) {
  console.error('❌ Falha ao iniciar a API:', erro.message);
  process.exitCode = 1;
  await mongoose.disconnect().catch(() => {});
}
