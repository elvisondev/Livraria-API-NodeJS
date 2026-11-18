import { HTTP_STATUS } from './../conf/http.js';

class ErroBase extends Error{
  constructor (mesagem = "Erro interno do servidor", status = HTTP_STATUS.INTERNAL_SERVER_ERROR){
    super()

    this.message = mesagem
    this.status = status

  }

  enviarResposta (res){
    res.status(this.status)
    .json({
      mesagem: this.message,
      status: this.status
    })
  }
}

export default ErroBase