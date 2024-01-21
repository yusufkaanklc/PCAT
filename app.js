// app.js
const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

// MongoDB bağlantısı
mongoose
  .connect('mongodb://127.0.0.1:27017/pcat')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log("MongoDB'e bağlanırken hata oluştu:", err));

// Template Engine
app.set('view engine', 'ejs');

// Middleware'ler
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride('_method'));

// Rotaları dahil et
app.use('/', routes);

const port = 3000;

// Sunucu Başlatma
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
