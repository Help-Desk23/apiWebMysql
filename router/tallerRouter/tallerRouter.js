const express = require('express');
const { addTalleres, updateTalleres, deleteTalleres } = require('../../controls/talleres/talleres');

const tallerRouter = express.Router();

//Ruta para agregar talleres

tallerRouter.post("/taller", addTalleres);

//Ruta para modificar talleres

tallerRouter.patch("/taller/:id", updateTalleres);

//Ruta para eliminar talleres

tallerRouter.delete("/taller/:id", deleteTalleres);

module.exports = tallerRouter;