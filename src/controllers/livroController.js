import { autor, livro } from '../models/index.js';
import { HTTP_STATUS } from './../conf/http.js';
import NaoEncontrado from '../error/NaoEncontrado.js';
import ErroConflict from './../error/ErroConflict.js';
import RequisicaoIncorreta from '../error/RequisicaoIncorreta.js';

class LivroController {
  static async listarLivros(req, res, next) {
    try {
      const listaLivros = livro.find();

      req.resultado = listaLivros;

      next();
    } catch (error) {
      next(error);
    }
  }

  static async buscarLivroID(req, res, next) {
    const ID = req.params.id;
    try {
      const buscarLivroID = await livro
        .findById(ID)
        .setOptions({ autopopulate: false })
        .populate('autor');
      if (buscarLivroID !== null) {
        res.status(HTTP_STATUS.OK).json(buscarLivroID);
      } else {
        next(new NaoEncontrado('Nenhum livro encontrado para o ID informado.'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async createLivro(req, res, next) {
    const novoLivro = req.body;

    try {
      const livroEncontrado = await livro.findOne({ titulo: novoLivro.titulo });
      const livroValidar = new livro(novoLivro);
      await livroValidar.validate();

      if (livroEncontrado) {
        return next(
          new ErroConflict(
            `O livro "${livroEncontrado.titulo}" já está cadastrado.`
          )
        );
      }

      const autorEncontrado = await autor.findById(novoLivro.autor);

      if (autorEncontrado !== null) {
        const livroCompleto = { ...novoLivro, autor: autorEncontrado._id };
        const livroCriado = await livro.create(livroCompleto);

        res.status(HTTP_STATUS.CREATED).json({
          message: 'Livro cadastrado com suscesso!',
          livro: livroCriado
        });
      } else {
        next(
          new NaoEncontrado('Autor não encontrado. Verifique o ID informado.')
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async atualizarLivroID(req, res, next) {
    try {
      const ID = req.params.id;
      const livroAntigo = await livro.findByIdAndUpdate(ID, req.body);

      if (livroAntigo !== null) {
        res.status(HTTP_STATUS.OK).json({ message: `Livro atualizado` });
      } else {
        next(new NaoEncontrado(`Livro não encontrado para o ${ID} informado`));
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteLivroID(req, res, next) {
    try {
      const ID = req.params.id;
      const deleteLivro = await livro.findByIdAndDelete(ID);

      if (deleteLivro !== null) {
        res
          .status(HTTP_STATUS.OK)
          .json({ message: 'Livro removido com sucesso!' });
      } else {
        next(new NaoEncontrado('Livro não encontrado!'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async listarLivrosFiltros(req, res, next) {
    // eslint-disable-next-line no-unused-vars
    const { editora, titulo, autores, preco, precoMin, precoMax } = req.query;
    try {
      const busca = {};

      if (titulo) {
        busca.titulo = { $regex: titulo, $options: 'i' };
      }

      if (editora) {
        busca.editora = { $regex: editora, $options: 'i' };
      }

      if (precoMin !== undefined || precoMax !== undefined) {
        busca.preco = {};

        if (precoMin !== undefined) {
          if (precoMin > 0) {
            busca.preco.$gte = Number(precoMin);
          } else {
            return next(
              new RequisicaoIncorreta(
                `O preço mínimo deve ser um número válido e maior que zero. Valor recebido: ${precoMin}`
              )
            );
          }
        }
        if (precoMax !== undefined) {
          if (precoMax > 0) {
            busca.preco.$lte = Number(precoMax);
          } else {
            return next(
              new RequisicaoIncorreta(
                `O preço máximo deve ser um número válido e maior que zero. Valor recebido: ${precoMax}`
              )
            );
          }
        }
      }

      if (autores) {
        const autorNome = await autor.findOne({
          nome: { $regex: autores, $options: 'i' }
        });

        if (!autorNome) {
          return res.status(HTTP_STATUS.OK).json([]);
        }
        busca.$or = [{ autor: autorNome._id }, { 'autor._id': autorNome._id }];
      }

      req.resultado = livro.find(busca);
      next();
    } catch (error) {
      next(error);
    }
  }
}

export default LivroController;
