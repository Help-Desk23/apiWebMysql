const express = require('express');
const { addMoto, updateMoto, deleteMoto } = require('../../controls/moto/moto');

const motoRouter = express.Router();

//Ruta para ingresar moto

motoRouter.post("/moto", addMoto);

//Ruta para actualizar moto

motoRouter.patch("/moto/:id", updateMoto);

//Ruta para eliminar motos

motoRouter.delete("/moto/:id", deleteMoto);

module.exports = motoRouter;