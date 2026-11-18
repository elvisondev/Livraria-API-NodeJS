import express from 'express';
import routes from './routes/main.js';
import manipuladorDeErros from './middlewares/manipuladorDeErros.js';
import manipulador404 from './middlewares/manipulador404.js';

const app = express();

routes(app);

// Rota não encontrada
app.use(manipulador404);

// Tratamento centralizado de erros
app.use(manipuladorDeErros);

export default app;
