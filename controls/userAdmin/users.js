const db = require('../../config/db');

//Controlador GET para mostrar usuario administradores

const getAdmin = async (socket) => {
    const query = 'SELECT * FROM useradmin';
    try{
        const [rows] = await db.promise().query(query);

        if (!rows || rows.length === 0){
            return socket.emit('error', {message: "No se encontró ningún usuario administrador" });
        }
        socket.emit('useradmin', rows);
    }catch(err){
        console.error("Error al obtener usuario adminisitradores:", err);
        socket.emit("error", {message: "Error al obtener usuario administradores"});
    }
};

//Controlador POST para crear nuevo usuario administrador

const addAdmin = async (req, res) => {
    const {nombre, email, contraseña, roles, estado} = req.body;
    const fecha_registro = new Date();

    try{
        const query = 'INSERT INTO useradmin (nombre, email, contraseña, roles, estado, fecha_registro) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [nombre, email, contraseña, roles, estado, fecha_registro];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al ingresar un usuario administrador", error);
                return res.status(500).json({error: "Error al registrar el administrador"})
            }
            res.status(201).json({ message: "Usuario ingresado correctamente" });
        });
    }catch(err){
        res.status(500).json({error: "Error interno del servidor"})
    }
};


//Controlador PATCH para editar usuario administrador

const updateAdmin = async (req, res) => {
    const {id} = req.params;
    const {nombre, email, contraseña, roles, estado} = req.body;
    const fecha_registro = new Date();

    const update = []
    const values = []

    if(nombre){
        update.push('nombre = ?');
        values.push(nombre);
    }

    if(email){
        update.push('email = ?');
        values.push(email);
    }

    if(contraseña){
        update.push('contraseña = ?');
        values.push(contraseña);
    }

    if(roles){
        if(roles !== 'administrador' && roles !== 'repuestos'){
            return res.status(400).json({error: "El valor de 'roles' debe ser 'adminitrador' o 'repuestos'"});
        }
        update.push("roles = ?");
        values.push(roles);
    }

    if(estado){
        if(estado !== 'activo' && estado !== 'inactivo'){
            return res.status(400).json({error: "El valor de 'estado' debe ser 'activo' o 'inactivo'" });
        }
        update.push('estado = ?');
        values.push(estado);
    }

    if(fecha_registro){
        update.push('fecha_registro = ?');
        values.push(fecha_registro);
    }

    if(update.length === 0){
        return res.status(400).json({error: "No se proporcionaron campos para actualizar"});
    }

    const query = `UPDATE useradmin SET ${update.join(', ')} WHERE id_admin = ?`;
    values.push(id);

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al actualizar el usuario administrador", error);
            return res.status(500).json({error: "Error al actualizar el usuario administrador"});
        }
        res.status(200).json({message: "Usuario Administrador actualizado correctamente"});
    });
};

// Controlador DELETE para eliminar un usuario administrador

const deleteAdmin = async (req, res) => {
    const {id} = req.params;
    const query = 'DELETE FROM useradmin WHERE id_admin = ?';
    const values = [id];

    db.query(query, values, (error, result) => {
        if(error){
            console.error("Error al eliminar usuario administrador", error);
            return res.status(500).json({error: "Error al eliminar usuario administrador"});
        } else {
            res.status(201).json({message: "Usuario eliminado correctamente"});
        }
    });
};

//Controlador para Login de usuario administrador

const loginAdmin = async (req, res) => {
    const {email, password} = req.body;

    try{
        const query = "SELECT * FROM useradmin WHERE email = ? AND password = ?";
        const values = [email, password];

        db.query(query, values, (error, result) => {
            if(error){
                console.error("Error al iniciar sesión", error);
                return res.status(500).json({error: "Error al iniciar sesión"});
            }
            if(result.length === 0){
                return res.status(401).json({error: "Usuario o contraseña incorrecta"});
            }
            const admin = result[0];

            if(asesor.estado !== 'activo'){
                return res.status(403).json({message: "El usuario esta inhabilitado"});
            }

            res.status(200).json({message: "Inicio exitoso", admin});
        });
    }catch(err){
        console.error("Error al iniciar sesión", err);
        res.status(500).json({error: "Error interno del servidor"})
    }
};

module.exports = {
    getAdmin,
    addAdmin,
    updateAdmin,
    deleteAdmin,
    loginAdmin
};
