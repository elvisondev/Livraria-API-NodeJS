import express from 'express'
import LivroController from '../controllers/livroController.js'

const routers = express.Router()

routers.get('/livros', LivroController.listarLivros)
routers.get("/livros/busca", LivroController.listaLivrosEditora)
routers.get("/livros/busca/titulo", LivroController.listaLivrosTitulos)
routers.get('/livros/:id', LivroController.buscarLivroID)

routers.post('/livros', LivroController.createLivro)
routers.put('/livros/:id', LivroController.atualizarLivroID)

routers.delete('/livros/:id', LivroController.deleteLivroID)





export default routers
