const db = require('../../config/db');
const multer = require('multer');
const path = require('path');

//Configuracion de multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

//Controlador GET para obtener los colores de las motos

const getColor = async (socket) => {
    const query = 'SELECT * FROM color';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun color de moto"});
        }
        socket.emit('color', rows);
    }catch(err){
        console.error("Error al obtener color", err);
        socket.emit('error', {message: "Error al obtener los colores"});
    }
};

//Controlador POST para agregar un color de moto

const addColor = async (req, res) => {
    const {id_moto, nombre_color} = req.body;
    const img_moto = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO color (id_moto, nombre_color, img_moto, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [id_moto, nombre_color, img_moto, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({message: "Color ingresado correctamente"});
    }catch(err){
        console.error("Error al ingresar un color de moto", err);
        res.status(500).json({error: "Error al ingresar un color de moto"});
    }
};

//Controlador PATCH para actualizar el color de la moto

const updateColor = async (req, res) => {
    const {id} = req.params;
    const {id_moto, nombre_color} = req.body;
    const img_moto = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_moto){
        update.push('id_moto = ?');
        values.push(id_moto);
    }

    if(nombre_color){
        update.push('nombre_color = ?');
        values.push(nombre_color);
    }

    if(img_moto){
        update.push('img_motos = ?');
        values.push(img_moto);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE color SET ${update.join(', ')} WHERE id_color = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar el color de la moto", error);
            return res.status(500).json({error: "Error al actualizar el color de la moto"})
        }
        res.status(200).json({message: "Color de la moto actualizada correctamente"});
    });
};

//Controlador DELETE para eliminar color de la moto

const deleteColor = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM color WHERE id_color = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar un color", error);
            return res.status(500).json({error: "Error al eliminar un color"})
        } else {
            res.status(201).json({message: "Color eliminado correctamente"});
        }
    })
};

module.exports = {
    getColor,
    addColor,
    updateColor,
    deleteColor,
    upload
};