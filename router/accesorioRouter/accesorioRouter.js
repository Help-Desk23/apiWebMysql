const express = require('express');
const { addAccesorios, updateAccesorios, deleteAccesorios } = require('../../controls/accesorios/accesorios');
const { upload } = require('../../middleware/multer');
const accesorioRouter = express.Router();

//Ruta para agregar los accesorios

accesorioRouter.post("/accesorios", upload.single("imagen_accesorio"), addAccesorios);

//Ruta para actualizar los accesorios

accesorioRouter.patch("/accesorios/:id", upload.single("imagen_accesorio"), updateAccesorios);

//Ruta para elimar accesorios

accesorioRouter.delete("/accesorios/:id", deleteAccesorios);

module.exports = accesorioRouter;
