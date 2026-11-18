import express from 'express';
import LivroController from '../controllers/livroController.js';
import paginar from '../middlewares/paginar.js';

const routers = express.Router();

routers.get('/livros', LivroController.listarLivros, paginar);
routers.get('/livros/busca', LivroController.listarLivrosFiltros, paginar);
routers.get('/livros/:id', LivroController.buscarLivroID);

routers.post('/livros', LivroController.createLivro);
routers.put('/livros/:id', LivroController.atualizarLivroID);

routers.delete('/livros/:id', LivroController.deleteLivroID);

export default routers;
