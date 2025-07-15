const db = require('../../config/db');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();


//Configuracion multer para recibir cv

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('El CV debe estar en formato PDF'));
    }
  }
});

//Controlador Socket para obtener las vacantes

const getVacante = async (socket) => {
    const query = 'SELECT * FROM vacantes';
    try{
        const [rows] = await db.promise().query(query);
        if(!rows || rows.length === 0){
            return socket.emit('error', { message: "No se encontro ninguna vacante" })
        }
        socket.emit('vacante', rows);
    }catch(err){
        console.error("Error al obtener la vacante", err);
        socket.emit("error", { message: "Error al obtener las vacantes" })
    }
};

//Controlador POST para crear nueva vacante

const addVacante = async (req, res) => {
    try {
        const { nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficios, estado } = req.body;
        const fecha_registro = new Date();
        const estadoFinal = estado?.trim() ? estado : 'activo';

        const query = `INSERT INTO vacantes ( nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficios, estado, fecha_registro ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [ nombre_vacante, ubicacion, modalidad, descripcion, JSON.stringify(requisitos), tipo_contrato, experiencia, JSON.stringify(beneficios), estadoFinal, fecha_registro ];

        db.query(query, values, (error, result) => {
            if (error) {
                console.error("Error al ingresar vacante", error);
                return res.status(500).json({ error: "Error al registrar vacante" });
            }

            res.status(201).json({ message: "Vacante ingresada correctamente" });
        });
    } catch (err) {
        console.error("Error interno del servidor", err);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};


//Controlador PATCH para editar las sucursales

const updateVacante = async (req, res) => {
    const {id} = req.params;
    const {nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficios, estado} = req.body;

    const update = []
    const values = []

    if(nombre_vacante){
        update.push('nombre_vacante = ?');
        values.push(nombre_vacante);
    }

    if(ubicacion){
        update.push('ubicacion = ?');
        values.push(ubicacion);
    }

    if(modalidad){
        update.push('modalidad = ?');
        values.push(modalidad);
    }

    if(descripcion){
        update.push('descripcion = ?');
        values.push(descripcion);
    }

    if(requisitos){
        update.push("requisitos = ?");
        values.push(JSON.stringify(requisitos));
    }

    if(tipo_contrato){
        update.push("tipo_contrato = ?");
        values.push(tipo_contrato);
    }

    if(experiencia){
        update.push("experiencia = ?");
        values.push(experiencia);
    }

    if(beneficios){
        update.push("beneficios = ?");
        values.push(JSON.stringify(beneficios));
    }

    if(estado){
        if(estado !== 'activo' && estado !== 'inactivo'){
            return res.status(400).json({error: "El valor de 'estado' debe ser 'activo' o 'inactivo'" });
        }
        update.push('estado = ?');
        values.push(estado);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"});
    }

    const query = `UPDATE vacantes SET ${update.join(', ')} WHERE id_vacante = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar la vacante", error);
            return res.status(500).json({error: "Error interno del servidor"});
        }
        res.status(200).json({message: "Vacante modificado correctamente"});
    });
};

//Controlador DELETE para eliminar sucursales

const deleteVacante = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM vacantes WHERE id_vacante = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar una vacante", error);
            return res.status(500).json({error: "Error al eliminar una vacante"});
        } else {
            res.status(201).json({message: "Vacante eliminada correctamente"});
        }
    });
};

//Controlador POST para recibir todas las postulaciones

const enviarPostulacion = async (req, res) => {
    const { nombre, email, mensaje, nombre_vacante } = req.body;
    const cv = req.file;
  
    if (!nombre || !email || !cv) {
      return res.status(400).json({ error: 'Nombre, email y CV son obligatorios' });
    }
  
    const transporter = nodemailer.createTransport({
      host: 'mail.vian.com.bo',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });
  
    const mailOptions = {
      from: email,
      to: 'reclutamiento@vian.com.bo',
      subject: `Nueva postulación - Vacante ${nombre_vacante || 'PÁGINA WEB'}`,
      text: `
        Nombre: ${nombre}
        Email: ${email}
        Vacante: ${nombre_vacante || 'No especificada'}
        Mensaje: ${mensaje || 'Sin mensaje'}
      `,
      attachments: [{
        filename: cv.originalname,
        content: cv.buffer
      }]
    };
  
    try {
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Postulación enviada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al enviar la postulación' });
    }
  };

module.exports = {
    getVacante,
    addVacante,
    updateVacante,
    deleteVacante,
    enviarPostulacion,
    upload
};