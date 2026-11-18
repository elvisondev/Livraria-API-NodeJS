import { autor } from './../models/index.js';
import { HTTP_STATUS } from './../conf/http.js';
import NaoEncontrado from '../error/NaoEncontrado.js';
import ErroConflict from '../error/ErroConflict.js';

class AutoresController {
  static async listarAutores(req, res, next) {
    try {
      const listaAutores = autor.find();

      req.resultado = listaAutores;
      next();
    } catch (error) {
      next(error);
    }
  }

  static async buscarAutorID(req, res, next) {
    const ID = req.params.id;
    try {
      const buscarAutorID = await autor.findById(ID);
      if (buscarAutorID != null) {
        res.status(HTTP_STATUS.OK).json(buscarAutorID);
      } else {
        next(new NaoEncontrado('Nenhum autor encontrado para o ID informado.'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async createAutor(req, res, next) {
    try {
      const nomeAutor = req.body.nome;
      const autorEncontrado = await autor.findOne({ nome: nomeAutor });

      if (autorEncontrado === null) {
        const novoAutor = await autor.create(req.body);

        res.status(HTTP_STATUS.CREATED).json({
          message: 'Autor cadastrado com suscesso!',
          autor: novoAutor
        });
      } else {
        next(new ErroConflict(`O autor "${nomeAutor}" já está cadastrado!`));
      }
    } catch (error) {
      next(error);
    }
  }

  static async atualizarAutorID(req, res, next) {
    try {
      const ID = req.params.id;
      const guardaAutor = await autor.findByIdAndUpdate(ID, req.body);

      if (guardaAutor) {
        res.status(HTTP_STATUS.OK).json({ message: 'Autor atualizado' });
      } else {
        next(new NaoEncontrado('Autor não encontrado para atualização.'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteAutorID(req, res, next) {
    try {
      const ID = req.params.id;
      const deleteAutor = await autor.findByIdAndDelete(ID);

      if (deleteAutor !== null) {
        res
          .status(HTTP_STATUS.OK)
          .json({ message: 'Autor removido com sucesso!' });
      } else {
        next(new NaoEncontrado('Autor não encontrado!'));
      }
    } catch (error) {
      next(error);
    }
  }
}

export default AutoresController;
