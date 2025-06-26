const db = require('../../config/db');

// Controlador GET para mostrar clientes

const getCliente = async (socket) => {
    const query = 'SELECT * FROM cliente';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningun cliente"});
        }
        socket.emit('cliente', rows);
    }catch(err){
        console.error("Error al obtener cliente", err);
        socket.emit("error", {message: "Error al obtener cliente"});
    }
};

// Controlador POST para crear nuevo cliente

const addCliente = async (req, res) => {
    const {nombre, telefono, email} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO cliente (nombre, telefono, email, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [nombre, telefono, email, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar al cliente", error);
                return res.status(200).json({message: "Error al ingresar al cliente"});
            }
            res.status(201).json({message: "Cliente ingresado correctamente"});
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"});
    }
};

//Controlador PATCH para editar cliente

const updateCliente = async (req, res) => {
    const {id} = req.params;
    const {nombre, telefono, email} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(nombre){
        update.push('nombre = ?');
        values.push(nombre);
    }

    if(telefono){
        update.push('telefono = ?');
        values.push(telefono);
    }

    if(email){
        update.push('email = ?');
        values.push(email);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    const query = `UPDATE cliente SET ${update.join(', ')} WHERE id_cliente = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar cliente", error);
            return res.status(500).json({error: "Error al actualizar cliente"});
        }
        res.status(200).json({message: "Cliente actualizado correctamente"});
    });
};

// Controlador DELETE para eliminar un cliente

const deleteCliente = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM cliente WHERE id_cliente = ?';
    const values = [id]

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar cliente", error);
            return res.status(500).json({error: "Error al eliminar cliente"});
        } else {
            res.status(201).json({message: "Cliente eliminado correctamente"});
        }
    });
};


module.exports = {
    getCliente,
    addCliente,
    updateCliente,
    deleteCliente
};