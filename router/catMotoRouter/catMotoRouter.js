const express = require('express');
const { addCatMoto, updateCatMoto, deleteCatMoto } = require('../../controls/categoriaMoto/categoriaMoto');

const catMotoRouter = express.Router();

//Ruta para agregar categorias de motos

catMotoRouter.post("/catmoto", addCatMoto);

//Ruta para actualizar las categorias de las motos

catMotoRouter.patch("/catmoto/:id", updateCatMoto);

//Ruta para eliminar las categorias de las motos

catMotoRouter.delete("/catmoto/:id", deleteCatMoto);

module.exports = catMotoRouter;