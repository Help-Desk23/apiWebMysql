const express = require('express');
const { addMarca, updateMarca, deleteMarca } = require('../../controls/marca/marca');

const marcaRouter = express.Router();

//Ruta para agregar marca

marcaRouter.post('/marca', addMarca);

//Ruta para actualizar marca

marcaRouter.patch('/marca/:id', updateMarca);

//Rita para eliminar marca

marcaRouter.delete('/marca/:id', deleteMarca);

module.exports = marcaRouter;