const express = require('express');
const { addFuncionarios, updateFuncionario, deleteFuncionario } = require('../../controls/funcionario/funcionario');
const upload = require('../../middleware/multer');

const funcionarioRouter = express.Router();

//Ruta POST para agregar funcionario

funcionarioRouter.post("/funcionario", upload.single('img_funcionario'), addFuncionarios);

//Ruta PATCH para editar funcionario

funcionarioRouter.patch("/funcionario/:id", upload.single('img_funcionario'), updateFuncionario);

//Ruta DELETE para eliminar funcionario

funcionarioRouter.delete("/funcionario/:id", deleteFuncionario);

module.exports = funcionarioRouter;