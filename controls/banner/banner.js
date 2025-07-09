const db = require('../../config/db');
const multer = require('multer');
const path = require('path');

//Configuracion de multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage: storage});

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

    const banner_top = req.files?.['banner_top']
        ? `https://www.api.vian.com.bo/uploads/${req.files['banner_top'][0].filename}`
        : null;

    const banner_sidebar = req.files?.['banner_sidebar']
        ? `https://www.api.vian.com.bo/uploads/${req.files['banner_sidebar'][0].filename}`
        : null;

    const fecha_registro = new Date();

    if (!id_marca) {
        return res.status(400).json({ error: "id_marca es requerido" });
    }

    if (!banner_top && !banner_sidebar) {
        return res.status(400).json({ error: "Se requiere al menos un banner" });
    }

    try {
        const query = 'INSERT INTO banner (id_marca, banner_top, banner_sidebar, fecha_registro) VALUES (?, ?, ?, ?)';
        const values = [id_marca, banner_top, banner_sidebar, fecha_registro];

        await db.promise().query(query, values);
        res.status(201).json({ message: "Banner ingresado correctamente" });
    } catch (err) {
        console.error("Error al ingresar un banner", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


module.exports = {
    getBanner,
    addBanner,
    upload
};