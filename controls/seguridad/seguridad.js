const db = require('../../config/db');

//Controlador GET para mostrar especificaciones de seguridad de la moto

const getSeguridad = async (socket) => {
    const query = 'SELECT * FROM seguridad';

    try{
        const [rows] = await db.promise().query(query);
        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna especificaciones de seguridad de la moto"})
        }
        socket.emit('seguridad', rows);
    }catch(err){
        console.error("Error al obtener las especificaciones de seguridad de la moto", err);
        socket.emit("error", {message: "Error al obtener las especificaciones de seguridad de la moto"})
    }
};

//Controlador POST para agregar especificaciones de seguridad de las motos

const addSeguridad = async (req, res) => {
    const {id_moto, freno_delantero, freno_trasero, suspension_delantera, suspension_trasera} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO seguridad (id_moto, freno_delantero, freno_trasero, suspension_delantera, suspension_trasera, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [id_moto, freno_delantero, freno_trasero, suspension_delantera, suspension_trasera, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar las especificaciones de seguridad de la moto", error)
                return res.status(500).json({error: "Error al ingresar las especificaciones de seguridad de la moto"});
            }
            res.status(201).json({message: "Especificaciones de seguridad registrado correctamente"})
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para actualizar especificiones de seguridad de las motos

const updateSeguridad = async (req, res) => {
    const {id} = req.params;
    const {id_moto, freno_delantero, freno_trasero, suspension_delantera, suspension_trasera} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_moto){
        update.push('id_moto = ?');
        values.push(id_moto);
    }

    if(freno_delantero){
        update.push('freno_delantero = ?');
        values.push(freno_delantero);
    }

    if(freno_trasero){
        update.push('freno_trasero = ?');
        values.push(freno_trasero);
    }

    if(suspension_delantera){
        update.push('suspension_delantera = ?');
        values.push(suspension_delantera);
    }

    if(suspension_trasera){
        update.push('suspension_trasera = ?');
        values.push(suspension_trasera);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporciono ninguna especificacion de seguridad de la moto"})
    }
    
    const query = `UPDATE seguridad SET ${update.join(', ')} WHERE id_seguridad = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar las especificaciones de seguridad de la moto", error);
            return res.status(500).json({error: "Error al actualziar las especificaciones de seguridad de la moto"})
        }
        res.status(200).json({message: "Especificaciones de seguridad actualizados correctamente"})
    });
};

//Controlador DELETE para eliminar las especificaciones de seguridad de una moto

const deleteSeguridad = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM seguridad WHERE id_seguridad = ?';
    const values = [id]

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar las especificaciones de seguridad de una moto", error)
            return res.status(500).json({error: "Error al eliminar las especificaciones de seguridad de una moto"})
        }else{
            res.status(201).json({message: "Especificaciones de seguridad eliminadas correctamente"})
        }
    });
};


module.exports = {
    getSeguridad,
    addSeguridad,
    updateSeguridad,
    deleteSeguridad
};