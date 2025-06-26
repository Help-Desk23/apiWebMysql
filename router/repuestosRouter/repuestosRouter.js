const express = require('express');
const { addRepuestos, updateRepuestos, upload, deleteRepuestos } = require('../../controls/repuestos/respuestos');

const repuestosRouter = express.Router();

//Ruta para agregar repuestos

repuestosRouter.post("/repuestos", upload.single("imagen_repuesto"), addRepuestos);

//Ruta para editar repuestos

repuestosRouter.patch("/repuestos/:id", upload.single("imagen_repuesto"), updateRepuestos);

//Ruta para eliminar repuestos

repuestosRouter.delete("/repuestos/:id", deleteRepuestos);

module.exports = repuestosRouter;