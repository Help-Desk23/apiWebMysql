const db = require('../../config/db');

//Controlador GET para mostrar las especificaciones de las motos

const getDimension = async (socket) => {
    const query = 'SELECT * FROM dimensiones';
    try{
        const [rows] = await db.promise().query(query);
        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningunas dimensiones"})
        }
        socket.emit('dimensiones', rows);
    }catch(err){
        console.error("Error al obtener las dimensiones de las motos", err);
        socket.emit("error", {message: "Error al obtener las dimensiones de las motos"})
    }
};

//Controlador POST para crear nuevas especificaciones para las motos

const addDimension = async (req, res) => {
    const {id_moto, rueda_delantera, rueda_trasera, dimension_total, distancia_ejes, peso} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO dimensiones (id_moto, rueda_delantera, rueda_trasera, dimension_total, distancia_ejes, peso, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [id_moto, rueda_delantera, rueda_trasera, dimension_total, distancia_ejes, peso, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar las dimensiones de las motos", error);
                return res.status(500).json({error: "Error al ingresar las dimensiones de las motos"})
            }
            res.status(201).json({message: "Dimensiones ingresada correctamente"});
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar las dimensiones de las motos

const updateDimensiones = async (req, res) => {
    const {id} = req.params;
    const {id_moto, rueda_delantera, rueda_trasera, dimension_total, distancia_ejes, peso} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_moto){
        update.push('id_moto = ?');
        values.push(id_moto);
    }

    if(rueda_delantera){
        update.push('rueda_delantera = ?');
        values.push(rueda_delantera);
    }

    if(rueda_trasera){
        update.push('rueda_trasera = ?');
        values.push(rueda_trasera);
    }

    if(dimension_total){
        update.push('dimension_total = ?');
        values.push(dimension_total);
    }

    if(distancia_ejes){
        update.push('distancia_ejes = ?');
        values.push(distancia_ejes);
    }

    if(peso){
        update.push('peso = ?');
        values.push(peso);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"})
    }

    const query = `UPDATE dimensiones SET ${update.join(', ')} WHERE id_dimension = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar las dimensiones de la moto", error);
            return res.status(500).json({error: "Error al actualizar las dimensiones de la moto"})
        }
        res.status(200).json({message: "Dimensiones actualizadas correctamente"})
    });
};

//Controlador DELETE para eliminar dimensiones de moto

const deleteDimension = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM dimensiones WHERE id_dimension = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar las dimensiones de la moto", error);
            return res.status(500).json({error: "Error al eliminar las dimensiones de la moto"})
        }else{
            res.status(201).json({message: "Dimension eliminado correctamente"})
        }
    });
};


module.exports = {
    getDimension,
    addDimension,
    updateDimensiones,
    deleteDimension
};