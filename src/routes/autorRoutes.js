import express from "express";
import AutoresController from "../controllers/autorController.js";
import paginar from './../middlewares/paginar.js';

const routers = express.Router();

routers.get("/autores", AutoresController.listarAutores, paginar);
routers.get("/autores/:id", AutoresController.buscarAutorID);

routers.post("/autores", AutoresController.createAutor);
routers.put("/autores/:id", AutoresController.atualizarAutorID);

routers.delete("/autores/:id", AutoresController.deleteAutorID);

export default routers;
