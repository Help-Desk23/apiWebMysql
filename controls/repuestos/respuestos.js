const db = require('../../config/db');

//Controlador GET para mostrar los respuestos

const getRepuestos = async (socket) => {
    const query = 'SELECT * FROM repuestos';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun repuestos"})
        }
        socket.emit('repuestos', rows);
    }catch(err){
        console.error("Error al obtener los repuestos", err)
        socket.emit("error", {message: "Error al obtener los respuestos"})
    }
};


//Controlador POST para agregar repuestos

const addRepuestos = async (req, res) => {
    const {id_marca, nombre_repuesto, detalle, precio} = req.body;
    const imagen_repuesto = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO repuestos (id_marca, nombre_repuesto, detalle, precio, imagen_repuesto, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [id_marca, nombre_repuesto, detalle, precio, imagen_repuesto, fecha_registro];
        
        await db.promise().query(query, values);
        res.status(201).json({message: "Repuesto ingresado correctamente"});
    }catch(err){
        console.error("Error al ingresar un repuestos", err);
        res.status(500).json({error: "Error al ingresar un repuestos"});
    }
};

//Controlador PATCH para actualizar los repuestos

const updateRepuestos = async (req, res) => {
    const {id} = req.params;
    const {id_marca, nombre_repuesto, detalle, precio} = req.body;
    const port = req.get('host').split(':')[1];
    const imagen_repuesto = req.file ? `https://www.api.vian.com.bo/uploads/${req.file.filename}` : null;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(nombre_repuesto){
        update.push('nombre_repuesto = ?');
        values.push(nombre_repuesto);
    }

    if(detalle){
        update.push('detalle = ?');
        values.push(detalle);
    }

    if(precio){
        update.push('precio = ?');
        values.push(precio);
    }

    if(imagen_repuesto){
        update.push('imagen_repuesto = ?');
        values.push(imagen_repuesto);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos editar"});
    }

    const query = `UPDATE repuestos SET ${update.join(', ')} WHERE id_repuestos = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar los repuestos", error);
            return res.status(500).json({error: "Error al actualizar los repuestos"})
        }
        res.status(200).json({message: "Repuestos actualizado correctamente"})
    })
};

//Controlador DELETE para eliminar repuestos

const deleteRepuestos = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM repuestos WHERE id_repuestos = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar repuestos", error);
            return res.status(500).json({error: "Error al eliminar repuestos"})
        } else {
            res.status(201).json({message: "Respuesto eliminado correctamente"})
        }
    });
};

module.exports = {
    getRepuestos,
    addRepuestos,
    updateRepuestos,
    deleteRepuestos
};