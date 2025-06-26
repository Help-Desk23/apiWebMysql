const db = require('../../config/db');

//Controlador GET para obtener las categorias de los accesorios

const getCategoria = async (socket) => {
    const query = 'SELECT * FROM categoria_accesorios';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna categoria"})
        }
        socket.emit('categoria', rows);
    }catch(err){
        console.error("Error al obtener las categorias", err)
        socket.emit('error', {message: "Error al obtener las categorias"});
    }
};

//Controlador POST para agregar categorias de los accesorios

const addCategoria = async (req, res) => {
    const {nombre_categoria} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO categoria_accesorios (nombre_categoria, fecha_registro) VALUES (?, ?)';
        const values = [nombre_categoria, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({message: "Categoria ingresada correctamente"});
    }catch(err){
        console.error("Error al ingresar categoria de accesorios", err);
        res.status(500).json({error: "Error al ingresar categorias de accesorios"})
    }
};

//Controlador PATCH para actualizar categorias de accesorios

const updateCategorias = async (req, res) => {
    const {id} = req.params;
    const {nombre_categoria} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(nombre_categoria){
        update.push('nombre_categoria = ?');
        values.push(nombre_categoria);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE categoria_accesorios SET ${update.join(', ')} WHERE id_categoria = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar las categorias", error);
            return res.status(500).json({error: "Error al actualizar las categorias"})
        }
        res.status(200).json({message: "Categoria actualizada correctamente"});
    });
};

//Controlador DELETE para eliminar categorias de accesorios

const deleteCategoria = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM categoria_accesorios WHERE id_categoria = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar categoria", error);
            return res.status(500).json({error: "Error al eliminar categoria"})
        } else {
            res.status(201).json({message: "Categoria eliminada correctamente"})
        }
    });
};

module.exports = {
    getCategoria,
    addCategoria,
    updateCategorias,
    deleteCategoria
};