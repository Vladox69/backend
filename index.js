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
app.use('/api/location',require('./routes/location'));
app.use('/api/staff',require('./routes/staff'));
app.use('/api/tax', require('./routes/tax'));
app.use('/api/payment-method', require('./routes/paymentMethod'));
app.use('/api/tax-rate', require('./routes/taxRate'));
app.use('/api/environment-type', require('./routes/environmentType'));
app.use('/api/customer-type', require('./routes/customerType'));
app.use('/api/customer', require('./routes/customer'));
app.use('/api/product', require('./routes/product'));
app.use('/api/sale', require('./routes/sale'));
app.use('/api/sale-detail', require('./routes/saleDetail'));
app.use('/api/payment-detail', require('./routes/paymentDetail'));
app.use('/api/sri', require('./routes/sri'));

//Escuchar las peticiones
app.listen(process.env.PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
});


