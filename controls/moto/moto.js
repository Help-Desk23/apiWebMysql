const db = require('../../config/db');


//Controlador GET para mostrar moto

const getMoto = async (socket) => {
    const query = 'SELECT * FROM moto';
    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ninguna moto"})
        }
        socket.emit('moto', rows);
    }catch(err){
        console.error("Error al obtener motos", err);
        socket.emit("error", {message: "Error al obtener motos"});
    }
};

//Controlador POST para crear nuevas motos

const addMoto = async (req, res) => {
    const {id_marca, modelo, descripcion, years, destacado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO moto (id_marca, modelo, descripcion, years, destacado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [id_marca, modelo, descripcion, years, destacado, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar moto", error);
                return res.status(500).json({error: "Error al registrar una moto"})
            }
            res.status(201).json({message: "Moto ingresada correctamente"});
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};

//Controlador PATCH para editar motos

const updateMoto = async (req, res) => {
    const {id} = req.params;
    const {id_marca, modelo, descripcion, years, destacado} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(modelo){
        update.push('modelo = ?');
        values.push(modelo);
    }

    if(descripcion){
        update.push('descripcion = ?');
        values.push(descripcion);
    }

    if(years){
        update.push('years = ?');
        values.push(years);
    }

    if (typeof destacado !== 'undefined') {
        update.push('destacado = ?');
        values.push(destacado ? 1 : 0);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    const query = `UPDATE moto SET ${update.join(', ')} WHERE id_moto = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar motos", error);
            return res.status(500).json({error: "Error al actualizar motos"});
        }
        res.status(200).json({message: "Moto actualizada correctamente"});
    });
};

//Controlador DELETE para eliminar moto

const deleteMoto = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM moto WHERE id_moto = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar moto", error);
            return res.status(500).json({error: "Error al eliminar una moto"});
        } else {
            res.status(201).json({message: "Moto eliminada correctamente"});
        }
    });
};

//Controlador Socket.emit muestra todas las motos con caracteristicas completas

const getMotoCompleta = async (socket) => {
    const query = `
        SELECT
            m.id_moto,
            m.id_marca,
            m.modelo,
            m.descripcion,
            m.years,
            m.destacado,
            m.fecha_registro AS fecha_moto,

            mt.id_motor,
            mt.cilindraje,
            mt.tipo_motor,
            mt.potencia,
            mt.torque,
            mt.tipo_transmision,
            mt.fecha_registro AS fecha_motor,

            c.id_color,
            c.nombre_color,
            c.img_moto,
            c.fecha_registro AS fecha_color,

            d.id_dimensiones,
            d.rueda_delantera,
            d.rueda_trasera,
            d.dimension_total,
            d.distancia_ejes,
            d.peso,
            d.fecha_registro AS fecha_dimension,

            s.id_seguridad,
            s.freno_delantero,
            s.freno_trasero,
            s.suspension_delantera,
            s.suspension_trasera,
            s.fecha_registro AS fecha_seguridad

        FROM moto m
        LEFT JOIN motor mt ON mt.id_moto = m.id_moto
        LEFT JOIN color c ON c.id_moto = m.id_moto
        LEFT JOIN dimensiones d ON d.id_moto = m.id_moto
        LEFT JOIN seguridad s ON s.id_moto = m.id_moto;
    `;

    try {
        const [rows] = await db.promise().query(query);

        if (!rows || rows.length === 0) {
            return socket.emit('error', { message: 'No se encontró información de motos.'});
        }

        socket.emit('motosCompletas', rows);
    } catch (error) {
        console.error("Error al obtener la información de motos:", error.message);
        socket.emit('error', { message: 'Error al obtener la información de motos.', error: error.message });
    }
};

module.exports = {
    getMoto,
    addMoto,
    updateMoto,
    deleteMoto,
    getMotoCompleta
};