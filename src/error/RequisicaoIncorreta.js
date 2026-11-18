import ErroBase from './ErroBase.js';
import { HTTP_STATUS } from './../conf/http.js';

class RequisicaoIncorreta extends ErroBase {
  constructor(message = 'Um ou mais dados estão incorretos') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export default RequisicaoIncorreta;
