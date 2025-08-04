const db = require('../../config/db');

//Controlador Socket para obtener todas las sucursales

const getSucursal = async (socket) => {
    const query = 'SELECT * FROM sucursal';
    try{
        const [rows] = await db.promise().query(query)

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna sucursal"})
        }
        socket.emit('sucursal', rows);
    }catch(err){
        console.error("Error al obtener sucursales", err);
        socket.emit("error", {message: "Error al obtener sucursales"})
    }
};

//Controlador POST para crear nueva sucursal

const addSucursal = async (req, res) => {
    const {id_marca, sucursal, telefono, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO sucursal (id_marca, sucursal, telefono, direccion, horario, longitud, latitud, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [id_marca, sucursal, telefono, direccion, horario, longitud, latitud, estado, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar sucursal", error);
                return res.status(500).json({error: "Error al registrar sucursal"})
            }
            res.status(201).json({ message: "Sucursal ingresada correctamente" });
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar las sucursales

const updateSucursales = async (req, res) => {
    const {id} = req.params;
    const {id_marca, sucursal, telefono, direccion, horario, longitud, latitud, estado} = req.body;
    const fecha_registro = new Date();

    const update = []
    const values = []

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(sucursal){
        update.push('sucursal = ?');
        values.push(sucursal);
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

    const query = `UPDATE sucursal SET ${update.join(', ')} WHERE id_sucursal = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar sucursales", error);
            return res.status(500).json({error: "Error al actualizar sucursales"});
        }
        res.status(200).json({message: "Sucursal modificado correctamente"});
    });
};

//Controlador DELETE para eliminar sucursales

const deleteSucursal = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM sucursal WHERE id_sucursal = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar sucursal", error);
            return res.status(500).json({error: "Error al eliminar sucursal"});
        } else {
            res.status(201).json({message: "Sucursal eliminada correctamente"});
        }
    });
};

module.exports = {
    getSucursal,
    addSucursal,
    updateSucursales,
    deleteSucursal
};