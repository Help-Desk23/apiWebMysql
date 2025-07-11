const express = require('express');
const { addVacante, updateVacante, deleteVacante } = require('../../controls/vacante/vacante');

const vacanteRouter = express.Router();

//Ruta para agregar vacantes

vacanteRouter.post("/vacante", addVacante);

//Ruta para actualizar vacantes

vacanteRouter.patch("/vacante/:id", updateVacante);

//Ruta para eliminar vacantes

vacanteRouter.delete("/vacante/:id", deleteVacante);

module.exports = vacanteRouter;