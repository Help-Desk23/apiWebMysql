const db = require('../../config/db');

//Controlador Socket para obtener todos los talleres

const getTalleres = async (socket) => {
    const query = 'SELECT * FROM talleres';
    try{
        const [rows] = await db.promise().query(query)

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun taller"})
        }
        socket.emit('taller', rows);
    }catch(err){
        console.error("Error al obtener talleres", err);
        socket.emit("error", {message: "Error al obtener talleres"})
    }
};

//Controlador POST para crear nuevos talleres

const addTalleres = async (req, res) => {
    const {id_marca, taller, telefono, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO talleres (id_marca, taller, telefono, direccion, horario, longitud, latitud, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [id_marca, taller, telefono, direccion, horario, longitud, latitud, estado, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar talleres", error);
                return res.status(500).json({error: "Error al registrar talleres"})
            }
            res.status(201).json({ message: "Taller ingresado correctamente" });
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar los talleres

const updateTalleres = async (req, res) => {
    const {id} = req.params;
    const {id_marca, taller, telefono, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    const update = []
    const values = []

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(taller){
        update.push('taller = ?');
        values.push(taller);
    }

    if(telefono){
        update.push('telefono = ?');
        values.push(telefono);
    }

    if(direccion){
        update.push('direccion = ?');
        values.push(direccion);
    }

    if(horario){
        update.push("horario = ?");
        values.push(horario);
    }

    if(longitud){
        update.push("longitud = ?");
        values.push(longitud);
    }

    if(latitud){
        update.push("latitud = ?");
        values.push(latitud);
    }

    if(estado){
        if(estado !== 'activo' && estado !== 'inactivo'){
            return res.status(400).json({error: "El valor de 'estado' debe ser 'activo' o 'inactivo'" });
        }
        update.push('estado = ?');
        values.push(estado);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"});
    }

    const query = `UPDATE talleres SET ${update.join(', ')} WHERE id_taller = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar los talleres", error);
            return res.status(500).json({error: "Error al actualizar los talleres"});
        }
        res.status(200).json({message: "Taller se modificado correctamente"});
    });
};

//Controlador DELETE para eliminar talleres

const deleteTalleres = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM talleres WHERE id_taller = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar talleres", error);
            return res.status(500).json({error: "Error al eliminar taller"});
        } else {
            res.status(201).json({message: "Taller eliminado correctamente"});
        }
    });
};


module.exports = {
    getTalleres,
    addTalleres,
    updateTalleres,
    deleteTalleres
};