const express = require('express');
const { addDimension, updateDimensiones, deleteDimension } = require('../../controls/dimension/dimension');

const dimensionRouter = express.Router();

//Ruta para agregar especificaciones de las motos

dimensionRouter.post("/dimension", addDimension);

//Ruta para actualizar las dimensiones de las motos

dimensionRouter.patch("/dimension/:id", updateDimensiones);

//Ruta para eliminar dimensiones de la moto

dimensionRouter.delete("/dimension/:id", deleteDimension);

module.exports = dimensionRouter;