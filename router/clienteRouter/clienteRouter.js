const express = require('express');
const { addCliente, updateCliente, deleteCliente } = require('../../controls/cliente/cliente');


const clienteRouter = express.Router();


// Ruta para agregar cliente

clienteRouter.post("/cliente", addCliente);

// Ruta para actualizar cliente

clienteRouter.patch("/cliente/:id", updateCliente);

// Ruta para eliminaar cliente

clienteRouter.delete("/cliente/:id", deleteCliente);


module.exports = clienteRouter;