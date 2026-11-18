import { HTTP_STATUS } from './../conf/http.js';

class ErroBase extends Error {
  constructor(
    message = 'Erro interno do servidor',
    status = HTTP_STATUS.INTERNAL_SERVER_ERROR
  ) {
    super(message);

    this.status = status;
  }

  enviarResposta(res) {
    res.status(this.status).json({
      message: this.message,
      status: this.status
    });
  }
}

export default ErroBase;
