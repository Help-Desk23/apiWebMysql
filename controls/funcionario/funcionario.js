const db = require('../../config/db');

//Controlador socket para obtener los funcionarios

const getFuncionarios = async(socket) => {
    const query = 'SELECT * FROM funcionario';

    try{
        const [rows] = await db.promise().query(query);
        
        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontró ningún funcionario" });
        }
        socket.emit('funcionario', rows);
    }catch(err){
        console.error("Error al obtener los funcionarios", err);
        socket.emit('error', { message: "Error al obtener funcionarios" });
    }
};

//Controlador POST para agregar funcionarios

const addFuncionarios = async (req, res) => {
    const { nombre, cargo, telefono } = req.body;
    const img_funcionario = req.file ? `https://www.api.vian.com.bo/upload/${req.filename}` : null;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO funcionario (nombre, cargo, telefono, img_funcionario, fecha_registro) VALUES (?, ?, ?, ?, ?)';
        const values = [nombre, cargo, telefono, img_funcionario, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({ message: "Funcionario ingresado correctamente" });
    }catch(err){
        console.error("Error al ingresar funcionario", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//Controlador PATCH para actualizar los funcionarios

const updateFuncionario = async (req, res) => {
    const { id } = req.params;
    const { nombre, cargo, telefono } = req.body;
    const img_funcionario = req.file ? `https:/www.api.vian.com.bo/uploads/${req.file.filename}` : null;

    const update = [];
    const values = [];

    if(nombre){
        update.push('nombre = ?');
        values.push(nombre);
    }

    if(cargo){
        update.push('cargo = ?');
        values.push(cargo);
    }

    if(telefono){
        update.push('telefono = ?');
        values.push(telefono);
    }

    if(img_funcionario){
        update.push('img_funcionario = ?');
        values.push(img_funcionario);
    }

    if(update.length === 0){
        return res.status(400).json({ error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE funcionario SET ${update.join(', ')} WHERE id_funcionario = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar funcionarios", error);
            return res.status(500).json({ error: "Error al actualizar funcionario" });
        }
        res.status(200).json({ message: "Funcionario actualizado correctamente" });
    });
}

//Controlador DELETE para eliminar funcionarios

const deleteFuncionario = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM funcionario WHERE id_funcionario = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar funcionario", error);
            return res.status(500).json({ error: "Error al eliminar un funcionario"});
        } else{
            res.status(201).json({ message: "Funcionario eliminado correctamente"});
        }
    });
};

module.exports = {
    getFuncionarios,
    addFuncionarios,
    updateFuncionario,
    deleteFuncionario
};