const express = require('express');
const { addColor, updateColor, deleteColor } = require('../../controls/colorMoto/color');
const { upload } = require('../../middleware/multer');

const colorRouter = express.Router();

//Ruta para agregar color de motos

colorRouter.post("/color", upload.single("img_moto"), addColor);

//Ruta para edditar el color de las motos

colorRouter.patch("/color/:id", upload.single("img_moto"), updateColor);

//Ruta para eliminar color de moto

colorRouter.delete("/color/:id", deleteColor);

module.exports = colorRouter;