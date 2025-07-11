const db = require('../../config/db');

//Controlador Socket para obtener las vacantes

const getVacante = async (socket) => {
    const query = 'SELECT * FROM sucursal';
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
    const {nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficios, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO vacante (nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficions, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [nombre_vacante, ubicacion, modalidad, descripcion, requisitos, tipo_contrato, experiencia, beneficios, estado, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar vacante", error);
                return res.status(500).json({error: "Error al registrar vacante"})
            }
            res.status(201).json({ message: "Vacante ingresada correctamente" });
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
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
        values.push(requisitos);
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
        values.push(beneficios);
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

    const query = `UPDATE vacante SET ${update.join(', ')} WHERE id_vacante = ?`;
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
    const query = 'DELETE FROM vacante WHERE id_vacante = ?';
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


module.exports = {
    getVacante,
    addVacante,
    updateVacante,
    deleteVacante
};