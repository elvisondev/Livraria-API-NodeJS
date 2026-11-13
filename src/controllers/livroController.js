import { autor } from '../models/Autor.js'
import livro from './../models/Livros.js'
import { HTTP_STATUS } from './../conf/http.js';

class LivroController {
  static async listarLivros(req, res) {
    try {
      const listaLivros = await livro.find({})
      res.status(HTTP_STATUS.OK).json(listaLivros)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: `${error.message} Falha na requisição` })
    }
  }

  static async buscarLivroID(req, res) {
    try {
      const ID = req.params.id
      const buscarLivroID = await livro.findById(ID)
      res.status(HTTP_STATUS.OK).json(buscarLivroID)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `${error.message} Falha na requisição de busca no livro`
      })
    }
  }

  static async createLivro(req, res) {
    const novoLivro = req.body

    try {
      const livroEncontrado = await livro.findOne({ titulo: novoLivro.titulo })
      if (livroEncontrado) {
        return res.status(HTTP_STATUS.CONFLICT).json({
          mensagem: `O livro "${livroEncontrado.titulo}" já está cadastrado.`
        })
      }

      const autorEncontrado = await autor.findById(novoLivro.autor)

      if (autorEncontrado !== null) {
        const livroCompleto = {
          ...novoLivro,
          autor: { ...autorEncontrado.toObject() }
        }
        const livroCriado = await livro.create(livroCompleto)

        res.status(HTTP_STATUS.CREATED).json({
          message: 'Livro cadastrado com suscesso!',
          livro: livroCriado
        })
      } else {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ mensagem: 'Autor não encontrado. Verifique o ID informado.' })
      }
    } catch (error) {
      console.error(error)
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: `${error.message} - Falha ao cadastra livro` })
    }
  }

  static async atualizarLivroID(req, res) {
    try {
      const ID = req.params.id
      const livroAntigo = await livro.findByIdAndUpdate(ID, req.body)

      if (livroAntigo !== null) {
        res.status(HTTP_STATUS.OK).json({ message: `Livro atualizado` })
      } else {
        res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ message: `Livro não encontrado para o ${ID} informado` })
      }
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `${error.message} Falha na atualização`
      })
    }
  }

  static async deleteLivroID(req, res) {
    try {
      const ID = req.params.id
      const deleteLivro = await livro.findByIdAndDelete(ID)

      if (deleteLivro !== null) {
        res.status(HTTP_STATUS.OK).json({ message: 'Livro removido com sucesso!' })
      } else {
        res.status(HTTP_STATUS.CONFLICT).json({ message: 'Livro não encontrado!' })
      }
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: `${error.message} Erro ao excluir o livro!` })
    }
  }

  static async listaLivrosEditora(req, res) {
    const editora = req.query.editora
    try {
      const livrosEditora = await livro.find({
        editora: { $regex: editora, $options: 'i' }
      })

      res.status(HTTP_STATUS.OK).json(livrosEditora)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: `${error.message} - Falha na buscar` })
    }
  }

  static async listaLivrosTitulos(req, res) {
    const titulo = req.query.titulo
    try {
      const livrosTitulos = await livro.find({
        titulo: { $regex: titulo, $options: 'i' }
      })

      res.status(HTTP_STATUS.OK).json(livrosTitulos)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: `${error.message} - Falha na buscar` })
    }
  }
}

export default LivroController
