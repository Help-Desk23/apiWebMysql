const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const { getAdmin } = require('./controls/userAdmin/users');
const adminRuter = require('./router/adminRouter/adminRouter');
const { getCliente } = require('./controls/cliente/cliente');
const clienteRouter = require('./router/clienteRouter/clienteRouter');
const { getMarca } = require('./controls/marca/marca');
const marcaRouter = require('./router/marcaRouter/marcaRouter');
const { getMoto, getMotoCompleta } = require('./controls/moto/moto');
const motoRouter = require('./router/motoRouter/motoRouter');
const { getMotor } = require('./controls/motor/motor');
const motorRouter = require('./router/motorRouter/motorRouter');
const { getColor } = require('./controls/colorMoto/color');
const colorRouter = require('./router/colorRouter/colorRouter');
const { getDimension } = require('./controls/dimension/dimension');
const dimensionRouter = require('./router/dimensionRouter/dimensionRouter');
const { getSeguridad } = require('./controls/seguridad/seguridad');
const seguridadRouter = require('./router/seguridadRouter/seguridadRouter');
const { getRepuestos } = require('./controls/repuestos/respuestos');
const repuestosRouter = require('./router/repuestosRouter/repuestosRouter');
const { getCategoria } = require('./controls/categoria/categoria');
const categoriaRouter = require('./router/categoriaRouter/categoriaRouter');
const { getAccesorios } = require('./controls/accesorios/accesorios');
const accesorioRouter = require('./router/accesorioRouter/accesorioRouter');
const { getSucursal } = require('./controls/sucursal/sucursal');
const sucursalRouter = require('./router/sucursalRouter/sucursalRouter');
const { getTalleres } = require('./controls/talleres/talleres');
const tallerRouter = require('./router/tallerRouter/tallerRouter');
const { getCatMoto } = require('./controls/categoriaMoto/categoriaMoto');
const catMotoRouter = require('./router/catMotoRouter/catMotoRouter');



const app = express();

app.use(cors({
  origin: [
    'http://localhost:6000',            
    'http://177.222.114.122',
    'http://localhost',
    'http://localhost:5173' 
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  credentials: true
}));


app.use(express.json());


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT']
  }
});

io.on('connection', (socket) => {
    console.log("Cliente conectado:", socket.id);

    //socket.on('obtenerAdmin', ({id_admin}) => getAdmin(socket, id_admin));
    socket.on('obtenerAdmin', () => getAdmin(socket));
    socket.on('obtenerCliente', () => getCliente(socket));
    socket.on('obtenerMarca', () => getMarca(socket));
    socket.on('obtenerMoto', () => getMoto(socket));
    socket.on('obtenerMotor', () => getMotor(socket));
    socket.on('obtenerColor', () => getColor(socket));
    socket.on('obtenerDimension', () => getDimension(socket));
    socket.on('obtenerSeguridad', () => getSeguridad(socket));
    socket.on('obtenerRepuestos', () => getRepuestos(socket));
    socket.on('obtenerCategoria', () => getCategoria(socket));
    socket.on('obtenerAccesorios', () => getAccesorios(socket));
    socket.on('obtenerMotosCompletas', () => getMotoCompleta(socket));
    socket.on('obtenerSucursal', () => getSucursal(socket));
    socket.on('obtenerTaller', () => getTalleres(socket));
    socket.on('obtenerCatMoto', () => getCatMoto(socket));

    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });

});

app.get('/', (req, res) => {
    res.end("Servidor funcionando correctamente");
});

app.use('/', adminRuter);
app.use('/', clienteRouter);
app.use('/', marcaRouter);
app.use('/', motoRouter);
app.use('/', motorRouter);
app.use('/', colorRouter);
app.use('/', dimensionRouter);
app.use('/', seguridadRouter);
app.use('/', repuestosRouter);
app.use('/', categoriaRouter);
app.use('/', accesorioRouter);
app.use('/', sucursalRouter);
app.use('/', tallerRouter);
app.use('/', catMotoRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.API_PORT;
server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
