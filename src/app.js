import express from 'express'
import connectDataBase from './conf/dbConecte.js'
import routes from './routes/main.js'
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js"
import manipulador404 from "./middlewares/manipulador404.js"

const conexao = await connectDataBase()

conexao.on('erro', erro => {
  console.log('erro de conexão', erro)
})

conexao.once('open', () => {
  console.log('Conexão com o banco feita com suscesso!')
})

const app = express()
routes(app)

// * Inicilização Midware 404
app.use(manipulador404)

// * Inicialização do Midware
app.use(manipuladorDeErros)

export default app
