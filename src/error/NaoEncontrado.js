import ErroBase from './ErroBase.js';
import { HTTP_STATUS } from './../conf/http.js';

class NaoEncontrado extends ErroBase {
  constructor(message = "Página não encontrada"){
    super(message, HTTP_STATUS.NOT_FOUND)
  }
}


export default NaoEncontrado