const express = require('express');
const { addSucursal, updateSucursales, deleteSucursal } = require('../../controls/sucursal/sucursal');

const sucursalRouter = express.Router();

//Ruta para agregar sucursales

sucursalRouter.post("/sucursal", addSucursal);

//Ruta para modificar sucursales

sucursalRouter.patch("/sucursal/:id", updateSucursales);

//Ruta para eliminar sucursales

sucursalRouter.delete("/sucursal/:id", deleteSucursal);

module.exports = sucursalRouter;