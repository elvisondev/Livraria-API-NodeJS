import { autor } from './../models/Autor.js'
import { HTTP_STATUS } from './../conf/http.js';


class AutoresController {
  static async listarAutores(req, res) {
    try {
    
      const listaAutores = await autor.find({})
      res.status(HTTP_STATUS.OK).json(listaAutores)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: `${error.message} Falha na requisição` })
    }
  }

  static async buscarAutorID(req, res) {
    try {
      const ID = req.params.id
      const buscarAutorID = await autor.findById(ID)
      res.status(HTTP_STATUS.OK).json(buscarAutorID)
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `${error.message} Falha na requisição de busca no livro`
      })
    }
  }

  static async createAutor(req, res) {
    try {
      const nomeAutor = req.body.nome
      const autorEncontrado = await autor.findOne({ nome: nomeAutor })

      if (autorEncontrado === null) {
        const novoAutor = await autor.create(req.body)

        res
          .status(HTTP_STATUS.CREATED)
          .json({ message: 'Autor cadastrado com suscesso!', autor: novoAutor })
      } else {
        res
          .status(HTTP_STATUS.CONFLICT)
          .json({
            message: ` O autor "${nomeAutor}" já está cadastrado!`,
            autor: autorEncontrado
          })
      }
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: `${error.message} - Falha ao cadastra novo autor` })
    }
  }

  static async atualizarAutorID(req, res) {
    try {
      const ID = req.params.id
      await autor.findByIdAndUpdate(ID, req.body)
      res.status(HTTP_STATUS.OK).json({ message: 'Livro atualizado' })
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: `${error.message} Falha na atualização`
      })
    }
  }

  static async deleteAutorID(req, res) {
    try {
      const ID = req.params.id
      const deleteAutor = await autor.findByIdAndDelete(ID)

      if (deleteAutor !== null) {
        res.status(HTTP_STATUS.OK).json({ message: 'Livro removido com sucesso!' })
      } else {
        res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Livro não encontrado!' })
      }
    } catch (error) {
      res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ message: `${error.message} Erro ao excluir o livro!` })
    }
  }
}

export default AutoresController
