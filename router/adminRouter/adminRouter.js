const express = require('express');
const { addAdmin, updateAdmin, deleteAdmin, loginAdmin } = require('../../controls/userAdmin/users');


const adminRuter = express.Router();


// Ruta para agregar usuario administrador

adminRuter.post("/admin", addAdmin);

// Ruta para actualizar usuario administrador

adminRuter.patch("/admin/:id", updateAdmin);

// Ruta para eliminar usuario administrador

adminRuter.delete("/admin/:id", deleteAdmin);

// Ruta para iniciar sesion

adminRuter.post("/admin/login", loginAdmin);

module.exports = adminRuter;