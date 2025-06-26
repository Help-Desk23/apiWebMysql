const db = require('../../config/db');

//Controlador GET para mostrar todas las marcas

const getMarca = async (socket) => {
    const query = 'SELECT * FROM marca';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna marca"});
        }
        socket.emit('marca', rows);
    }catch(err){
        console.error("Error al obtener marcas", err);
        socket.emit("error", {message: "Error al obtener marcas"});
    }
};

//Controlador POST para agregar marca

const addMarca = async (req, res) => {
    const {marca} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO marca (marca, fecha_registro) VALUES (?, ?)';
        const values = [marca, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar una marca");
                return res.status(500).json({error: "Error al ingresar una marca"});
            }
            res.status(200).json({message: "Marca ingresada correctamente"})
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar marca

const updateMarca = async (req, res) => {
    const {id} = req.params;
    const {marca} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(marca){
        update.push('marca = ?');
        values.push(marca);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?')
        values.push(fecha_registro)
    }

    const query = `UPDATE marca SET ${update.join(', ')} WHERE id_marca = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar marca", error);
            return res.status(500).json({error: "Error al actualizar marca"});
        }
        res.status(200).json({message: "Marca actualizada correctamente"})
    });
};

//Controlador DELETE para eliminar marca

const deleteMarca = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM marca WHERE id_marca = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar marca", error);
            return res.status(500).json({error: "Error al eliminar marca"})
        }else{
            res.status(201).json({message: "Marca eliminada correctamente"});
        }
    });
};


module.exports = {
    getMarca,
    addMarca,
    updateMarca,
    deleteMarca
};