const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const fileUpload = require('express-fileupload');
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
app.use(fileUpload()); // burada dosya yuklemek için gerekli middleware eklendi

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
  // burada formdan gelen verilerin kaydedilmesi için gerekli middleware eklendi
  try {
    const uploadDir = 'public/uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let uploadedImage = req.files.image;
    console.log(uploadedImage);
    let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

    uploadedImage.mv(uploadPath, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }

      await Photo.create({
        ...req.body,
        image: '/uploads/' + uploadedImage.name,
      });
    });

    res.redirect('/');
  } catch (error) {
    console.log('Veri kaydetme hatası: ' + error);
  }
});

app.get('/photos/:id', async (req, res) => {
  // burada tekil verilerin getirilmesi için gerekli middleware eklendi
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    res.render('photo', { photo });
  } catch (error) {
    console.log('Veri getirme hatası ' + error);
  }
});
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});

// ejs kullanabilmek için view adlı klasoru oluşturup içine html dosyasalarını kopyalıyoruz
// ve uzantısını .ejs ile değiştiriyoruz
// Ek olarak html deki kop parçalarını parça parça include edebiliriz
// ve kod tekrarını engellemiş oluruz (<%- include(filepath) -%>)
