const express = require('express');
const morgan = require('morgan');
const app = express();
const productsRouter = require('./routes/productsRoutes');
//BODY PARSER
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(morgan('dev'));
app.use('/api/v1/products', productsRouter);

module.exports = app;
