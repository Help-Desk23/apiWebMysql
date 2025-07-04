const db = require('../../config/db');

//Controlador Socket para obtener las categorias de las motos

const getCatMoto = async (socket) => {
    const query = 'SELECT * FROM categoria_moto';

    try{
        const [rows] = await db.promise().query(query);
        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna categoria de moto"})
        }
        socket.emit('catmoto', rows);
    }catch(err){
        console.error("Error al obtener las categorias de las motos", err)
        socket.emit('error', {message: "Error al obtener las categorias de las motos"});
    }
};

//Controlador POST para agregar categorias de motos

const addCatMoto = async (req, res) => {
    const {categoria_moto} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO categoria_moto (categoria_moto, fecha_registro) VALUES (?, ?)';
        const values = [categoria_moto, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({message: "Categoria de las motos ingresada correctamente"});
    }catch(err){
        console.error("Error al ingresar categoria de las motos", err);
        res.status(500).json({error: "Error al ingresar categorias de las motos"})
    }
};

//Controlador PATCH para actualizar categorias de las motos

const updateCatMoto = async (req, res) => {
    const {id} = req.params;
    const {categoria_moto} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(categoria_moto){
        update.push('categoria_moto = ?');
        values.push(categoria_moto);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE categoria_moto SET ${update.join(', ')} WHERE id_catmoto = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar las categorias de motos", error);
            return res.status(500).json({error: "Error al actualizar las categorias de las motos"})
        }
        res.status(200).json({message: "Categoria actualizada correctamente"});
    });
};

//Controlador DELETE para eliminar categorias de accesorios

const deleteCatMoto = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM categoria_moto WHERE id_catmoto = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar categoria de motos", error);
            return res.status(500).json({error: "Error al eliminar categoria categorias de motos"})
        } else {
            res.status(201).json({message: "Categoria eliminada correctamente"})
        }
    });
};



module.exports = {
    getCatMoto,
    addCatMoto,
    updateCatMoto,
    deleteCatMoto
};