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
    const { id_marca, id_catmoto, modelo, descripcion, years, destacados, enlace_3d, precio_usd, inicial_bs } = req.body;
    const fecha_registro = new Date(); // Este valor se crea correctamente

    try {
        const query = 'INSERT INTO moto (id_marca, id_catmoto, modelo, descripcion, years, destacados, enlace_3d, fecha_registro, precio_usd, inicial_bs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        
        const values = [id_marca, id_catmoto, modelo, descripcion, years, destacados, enlace_3d, fecha_registro, precio_usd, inicial_bs];
        
        db.query(query, values, (error, result) => {
            if (error) {
                console.error("Error al ingresar moto", error);
                return res.status(500).json({ error: "Error al registrar una moto" });
            }
            const id_moto = result.insertId;
            console.log(id_moto);
            res.status(201).json({ message: "Moto ingresada correctamente", id_moto });
        });
    } catch (err) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

//Controlador PATCH para editar motos

const updateMoto = async (req, res) => {
    const {id} = req.params;
    const {id_marca, id_catmoto, modelo, descripcion, years, destacados, enlace_3d, precio_usd, inicial_bs} = req.body;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(id_catmoto){
        update.push('id_catmoto = ?');
        values.push(id_catmoto);
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

    if (typeof destacados !== 'undefined') {
        update.push('destacados = ?');
        values.push(destacados ? 1 : 0);
    }

    if(precio_usd){
        update.push('precio_usd = ?');
        values.push(precio_usd);
    }

    if(inicial_bs){
        update.push('inicial_bs = ?');
        values.push(inicial_bs);
    }

    if(enlace_3d){
        update.push('enlace_3d = ?');
        values.push(enlace_3d);
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

//Controlador Socket.emit muestra todas las motos con caracteristicas completas

const getMotoCompleta = async (socket) => {
    const query = `
        SELECT
            m.id_moto,
            m.id_marca,
            m.modelo,
            m.descripcion,
            m.years,
            m.destacados,
            m.enlace_3d,
            m.precio_usd,
            m.inicial_bs,

            mt.id_motor,
            mt.cilindraje,
            mt.tipo_motor,
            mt.potencia,
            mt.torque,
            mt.tipo_transmision,

            c.id_color,
            c.nombre_color,
            c.img_moto,

            d.id_dimensiones,
            d.rueda_delantera,
            d.rueda_trasera,
            d.dimension_total,
            d.distancia_ejes,
            d.peso,

            s.id_seguridad,
            s.freno_delantero,
            s.freno_trasero,
            s.suspension_delantera,
            s.suspension_trasera,

            cm.id_catmoto,
            cm.categoria_moto

        FROM moto m
        LEFT JOIN motor mt ON mt.id_moto = m.id_moto
        LEFT JOIN color c ON c.id_moto = m.id_moto
        LEFT JOIN dimensiones d ON d.id_moto = m.id_moto
        LEFT JOIN seguridad s ON s.id_moto = m.id_moto
        LEFT JOIN categoria_moto cm ON cm.id_catmoto = m.id_catmoto;
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


//Controlador DELETE para eliminar todos las motos completamente

const deleteMotoCompleta = async (req, res) => {
    const {id_moto} = req.params;

    if(!id_moto){
        return res.status(400).json({ message: "Falta el parametro id_moto" });
    }
    const connection = await db.promise().getConnection();

    try{
        await connection.beginTransaction();
        await connection.query(`DELETE FROM motor WHERE id_moto = ?`, [id_moto]);
        await connection.query(`DELETE FROM color WHERE id_moto = ?`, [id_moto]);
        await connection.query(`DELETE FROM dimensiones WHERE id_moto = ?`, [id_moto]);
        await connection.query(`DELETE FROM seguridad WHERE id_moto = ?`, [id_moto]);

        const [result] = await connection.query(`DELETE FROM moto WHERE id_moto = ?`, [id_moto]);

        await connection.commit();

        if(result.affectedRows === 0){
            return res.status(404).json({message: "No se encontro moto para eliminar"});
        }

        res.status(200).json({ message: "Moto eliminado completamente"});
    }catch(error){
        await connection.rollback();
        console.error("Error al eliminar una moto y sus relaciones", error.message);
        res.status(500).json({ message: "Error al eliminar una moto y sus relaciones"});
    } finally {
        connection.release();
    }
};


module.exports = {
    getMoto,
    addMoto,
    updateMoto,
    getMotoCompleta,
    deleteMotoCompleta
};