import mongoose from 'mongoose';
import mongooseAutoPopulate from 'mongoose-autopopulate';

const livroSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    titulo: {
      type: String,
      required: [true, 'O titulo do livro é obrigatório']
    },
    editora: { type: String,
    required: [true, 'A editora é obrigatória'],
   },
    preco: {
      type: Number
    },
    paginas: {
      type: Number,
      min: [10, 'O número de páginas deve estar entre 10 e 1000. Valor fornecido: {VALUE}'],
      max: [1000, 'O número de páginas deve estar entre 10 e 1000. Valor fornecido: {VALUE}']
    },

    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'autores',
      required: [true, 'O nome do(a) autor(a) é obrigatório'],
      autopopulate: {select: "nome"}
    }
  },
  { versionKey: false }
);

livroSchema.plugin(mongooseAutoPopulate);
const livro = mongoose.model('livros', livroSchema);

export default livro;
