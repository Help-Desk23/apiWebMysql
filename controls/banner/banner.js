const db = require('../../config/db');

//Controlador socket para obtener los banner de la pagina web

const getBanner = async (socket) => {
    const query = 'SELECT * FROM banner';

    try{
        const [rows] = await db.promise().query(query);

        if(!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontro ningún banner"});
        }
        socket.emit('banner', rows);
    }catch(err){
        console.error("Error al obtener los banner", err);
        socket.emit('error', {message: "Error al obtener los banner"});
    }
};

//Controlador POST para agregar un color de moto

const addBanner = async (req, res) => {
    const { id_marca } = req.body;
    const banner_top = req.files?.['banner_top'] ? `https://www.api.vian.com.bo/uploads/${req.files['banner_top'][0].filename}` : null;
    const banner_sidebar = req.files?.['banner_sidebar'] ? `https://www.api.vian.com.bo/uploads/${req.files['banner_sidebar'][0].filename}` : null;
    const fecha_registro = new Date();

    if (!id_marca) {
        return res.status(400).json({ error: "id_marca es requerido" });
    }

    if (!banner_top && !banner_sidebar) {
        return res.status(400).json({ error: "Se requiere al menos un banner" });
    }

    try {
        const [marcaResult] = await db.promise().query('SELECT 1 FROM marca WHERE id_marca = ?', [id_marca]);
        if (marcaResult.length === 0) {
            return res.status(400).json({ error: "La marca especificada no existe" });
        }

        const query = 'INSERT INTO banner (id_marca, banner_top, banner_sidebar, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [id_marca, banner_top, banner_sidebar, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({ message: "Banner ingresado correctamente" });
    } catch (err) {
        console.error("Error al ingresar un banner", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


//Controlador PATCH para editar los banners

const updateBanner = async (req, res) => {
    const {id} = req.params;
    const {id_marca} = req.body;
    const banner_top = req.files?.['banner_top'] ? `https://www.api.vian.com.bo/uploads/${req.files['banner_top'][0].filename}` : null;
    const banner_sidebar = req.files?.['banner_sidebar'] ? `https://www.api.vian.com.bo/uploads/${req.files['banner_sidebar'][0].filename}` : null;
    const fecha_registro = new Date();

    const update = [];
    const values = [];

    if(id_marca){
        update.push('id_marca = ?');
        values.push(id_marca);
    }

    if(banner_top){
        update.push('banner_top = ?');
        values.push(banner_top);
    }

    if(banner_sidebar){
        update.push('banner_sidebar = ?');
        values.push(banner_sidebar);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({ error: "No se proporcionaron campos para editar"});
    }

    const query = `UPDATE banner SET ${update.join(', ')} WHERE id_banner = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar banner", error);
            return res.status(500).json({error: "Error interno del servidor"})
        }
        res.status(200).json({message: "Banner actualizado correctamente"});
    });

};

//Controlador DELETE para eliminar banner

const deleteBanner = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM banner WHERE id_banner = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar un banner", error);
            return res.status(500).json({error: "Error interno del servidor"})
        } else {
            res.status(201).json({message: "Banner eliminado correctamente"})
        }
    });
};


module.exports = {
    getBanner,
    addBanner,
    updateBanner,
    deleteBanner
};