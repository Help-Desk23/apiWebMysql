const express = require('express');
const { addCategoria, updateCategorias, deleteCategoria } = require('../../controls/categoria/categoria');

const categoriaRouter = express.Router();

//Ruta para agregar categorias de accesorios

categoriaRouter.post("/categoria", addCategoria);

//Ruta para actualizar categorias de accesorios

categoriaRouter.patch("/categoria/:id", updateCategorias);

//Ruta para eliminar categorias de accesorios

categoriaRouter.delete("/categoria/:id", deleteCategoria);

module.exports = categoriaRouter;