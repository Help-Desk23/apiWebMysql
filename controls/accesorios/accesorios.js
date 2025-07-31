const db = require('../../config/db');

//Controlador GET para obtener los accesorios

const getAccesorios = async (socket) => {
    const query = 'SELECT * FROM accesorios';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun accesorio"})
        }
        socket.emit('accesorios', rows);
    }catch(err){
        console.error("Error al obtener accesorios", err);
        socket.emit('error', {message: "Error al obtener accesorios"});
    }
};

//Controlador POST para ingresar accesorios

const addAccesorios = async (req, res) => {
    const {id_marca, id_categoria, nombre_accesorio, descripcion} = req.body;
    const imagen_accesorio = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO accesorios (id_marca, id_categoria, nombre_accesorio, descripcion, imagen_accesorio, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [id_marca, id_categoria, nombre_accesorio, descripcion, imagen_accesorio, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({message: "Accesorio ingresado correctamente"});
    }catch(err){
        console.error("Error al ingresar un accesorio", err);
        res.status(500).json({error: "Error al ingresar un accesorio"});
    }

};

//Controlador PATCH para actualizar accesorios

const updateAccesorios = async (req, res) => {
    const {id} = req.params;
    const {id_marca, id_categoria, nombre_accesorio, descripcion} = req.body;
    const imagen_accesorio = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(id_categoria){
        update.push('id_categoria = ?');
        values.push(id_categoria);
    }

    if(nombre_accesorio){
        update.push('nombre_accesorio = ?');
        values.push(nombre_accesorio);
    }

    if(descripcion){
        update.push('descripcion = ?');
        values.push(descripcion);
    }

    if(imagen_accesorio){
        update.push('imagen_accesorio = ?');
        values.push(imagen_accesorio);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE accesorios SET ${update.join(', ')} WHERE id_accesorios = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar accesorios", error);
            return res.status(500).json({error: "Error al actualizar accesorios"})
        }
        res.status(200).json({message: "Accesorios actualizada correctamente"});
    });
};

//Controlador DELETE para eliminar accesorios

const deleteAccesorios = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM accesorios WHERE id_accesorios = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar accesorios", error);
            return res.status(500).json({error: "Error al eliminar accesorios"})
        } else {
            res.status(201).json({message: "Accesorio eliminado correctamente"});
        }
    })
};

module.exports = {
    getAccesorios,
    addAccesorios,
    updateAccesorios,
    deleteAccesorios,
    upload
};