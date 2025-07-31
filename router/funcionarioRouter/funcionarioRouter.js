const express = require('express');
const { addFuncionarios, updateFuncionario, deleteFuncionario } = require('../../controls/funcionario/funcionario');
const upload = require('../../middleware/multer');

const funciorioRouter = express.Router();

//Ruta POST para agregar funcionario

funciorioRouter.post("/funcionario", upload.single('img_funcionario'), addFuncionarios);

//Ruta PATCH para editar funcionario

funciorioRouter.patch("/funcionario/:id", upload.single('img_funcionario'), updateFuncionario);

//Ruta DELETE para eliminar funcionario

funciorioRouter.delete("/funcionario/:id", deleteFuncionario);

module.exports = funciorioRouter;