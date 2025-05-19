const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { dbConnection } = require('./db/config');

//ejecutar la base mongod

//Crear el servidor de express
const app = express();

//Base de datos
dbConnection();

//cors
app.use(cors());

//Directorio Publico
app.use(express.static('public'));

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth',require('./routes/auth'));
app.use('/api/business',require('./routes/business'));


//Escuchar las peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});


