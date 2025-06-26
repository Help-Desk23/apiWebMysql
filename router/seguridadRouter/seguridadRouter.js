const express = require('express');
const { addSeguridad, updateSeguridad, deleteSeguridad } = require('../../controls/seguridad/seguridad');

const seguridadRouter = express.Router();

//Ruta para agregar las especificaciones de seguridad de las motos

seguridadRouter.post("/seguridad", addSeguridad);

//Ruta para actualizar las especificaciones de seguridad de la motos

seguridadRouter.patch("/seguridad/:id", updateSeguridad);

//Ruta para eliminar las especificaciones de seguridad de las motos

seguridadRouter.delete("/seguridad/:id", deleteSeguridad);


module.exports = seguridadRouter;