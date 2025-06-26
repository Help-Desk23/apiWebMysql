const db = require('../../config/db');

//Controlador GET para motor

const getMotor = async (socket) => {
    const query = 'SELECT * FROM motor';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro motor"})
        }
        socket.emit('motor', rows);
    }catch(err){
        console.error("Error al obtener motor", err);
        socket.emit("error", {message: "Error al obtener motor"});
    }
};

//Controlador POST para agregar caracteristicas de motor

const addMotor = async (req, res) => {
    const {id_moto, cilindraje, tipo_motor, potencia, torque, tipo_transmision} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO motor (id_moto, cilindraje, tipo_motor, potencia, torque, tipo_transmision, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [id_moto, cilindraje, tipo_motor, potencia, torque, tipo_transmision, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar motor", error);
                return res.status(500).json({error: "Error al ingresar motor"})
            }
            res.status(201).json({message: "Motor ingresado correctamente"});
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para modificar el motor

const updateMotor = async (req, res) => {
    const {id} = req.params;
    const {id_moto, cilindraje, tipo_motor, potencia, torque, tipo_transmision} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_moto){
        update.push('id_moto = ?');
        values.push(id_moto);
    }

    if(cilindraje){
        update.push('cilindraje = ?');
        values.push(cilindraje);
    }

    if(tipo_motor){
        update.push('tipo_motor = ?');
        values.push(tipo_motor);
    }

    if(potencia){
        update.push('potencia = ?');
        values.push(potencia);
    }

    if(torque){
        update.push('torque = ?');
        values.push(torque);
    }

    if(tipo_transmision){
        update.push('tipo_transmision = ?');
        values.push(tipo_transmision);
    }

    if(fecha_registro){
        update.push('fecha_registro= ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"});
    }

    const query = `UPDATE motor SET ${update.join(', ')} WHERE id_motor = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar motor", error);
            return res.status(500).json({error: "Error al actualizar motor"});
        }
        res.status(200).json({message: "Motor actualizado correctamente"});
    });
};

//Controlador DELETE para eliminar motor

const deleteMotor = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM motor WHERE id_motor = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar motor", error);
            return res.status(500).json({error: "Error al eliminar motor"});
        } else {
            res.status(201).json({message: "Motor eliminado correctamente"});
        }
    });
};

module.exports = {
    getMotor,
    addMotor,
    updateMotor,
    deleteMotor
};