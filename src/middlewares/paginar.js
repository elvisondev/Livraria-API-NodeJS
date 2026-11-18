import RequisicaoIncorreta from './../error/RequisicaoIncorreta.js';
import { HTTP_STATUS } from './../conf/http.js';

async function paginar(req, res, next) {
  try {
    let { limite = 5, paginas = 1 } = req.query;
    const { ordenacao = '_id:-1' } = req.query;
    // * campoOrdenacao = "_id", ordem = -1
    

    const [campoOrdenacao, ordemTexto] = ordenacao.split(':');
    const ordem = parseInt(ordemTexto, 10);

    limite = parseInt(limite);
    paginas = parseInt(paginas);

    const resultado = req.resultado;

    if (limite > 0 && paginas > 0) {
      const resultadoPaginado = await resultado.find()
        .sort({ [campoOrdenacao]: ordem })
        .skip((paginas - 1) * limite)
        .limit(limite)
        .exec();
      res.status(HTTP_STATUS.OK).json(resultadoPaginado);
    } else {
      next(new RequisicaoIncorreta());
    }
  } catch (error) {
    next(error);
  }
}

export default paginar;
