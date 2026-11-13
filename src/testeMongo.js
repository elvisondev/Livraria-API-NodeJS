import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

try {
  await client.connect();

  const db = client.db("Livraria");
  const livros = db.collection("livros");

  const resultado = await livros.find({}).toArray();

  console.log(resultado);
} catch (erro) {
  console.error("Erro ao conectar:", erro.message);
} finally {
  await client.close();
}