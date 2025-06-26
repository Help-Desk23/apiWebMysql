const express = require('express');
const { addMotor, updateMotor, deleteMotor } = require('../../controls/motor/motor');

const motorRouter = express.Router();

//Ruta para agregar motor

motorRouter.post("/motor", addMotor);

//Ruta para modificar motor

motorRouter.patch("/motor/:id", updateMotor);

//Ruta para eliminar motor

motorRouter.delete("/motor/:id", deleteMotor);

module.exports = motorRouter;