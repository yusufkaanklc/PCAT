const express = require('express');
const ejs = require('ejs');
const Photo = require('./models/Photo');
const mongoose = require('mongoose');
const app = express();

mongoose
  .connect('mongodb://127.0.0.1:27017/pcat')
  .then(console.log('MongoDB connected'))
  .catch((err) => console.log("MongoDB'e baglanırken hata oluştu: ", err));

// Template Engine
app.set('view engine', 'ejs');

// burada middleware ile dosyalarımızı statik olarak yükledik
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // burada req body kısmındaki form verilerini okumak için gerekli middleware eklendi
app.use(express.json()); // burada istekteki json verilerini okumak için gerekli middleware eklendi

const port = 3000;

// Routing
app.get('/', async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.render('index', { photos }); // burada index.ejs dosyasını render ediyoruz
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});

app.get('/about', (req, res) => {
  res.render('about'); // burada about.ejs dosyasını render ediyoruz
});

app.get('/add', (req, res) => {
  res.render('add'); // burada add.ejs dosyasını render ediyoruz
});

app.post('/photos', async (req, res) => {
  try {
    await Photo.create(req.body);
    res.redirect('/add');
  } catch (error) {
    console.log('Resim kaydetme hatası: ' + error);
  }
});
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});

// ejs kullanabilmek için view adlı klasoru oluşturup içine html dosyasalarını kopyalıyoruz
// ve uzantısını .ejs ile değiştiriyoruz
// Ek olarak html deki kop parçalarını parça parça include edebiliriz
// ve kod tekrarını engellemiş oluruz (<%- include(filepath) -%>)
