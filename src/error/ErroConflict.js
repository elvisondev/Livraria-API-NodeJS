import ErroBase from './ErroBase.js';
import { HTTP_STATUS } from './../conf/http.js';

class ErroConflict extends ErroBase {
  constructor (message =  "Recurso já cadastrado!"){
    super(message, HTTP_STATUS.CONFLICT)
  }
}

export default ErroConflict