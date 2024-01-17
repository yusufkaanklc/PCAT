const express = require('express');
const ejs = require('ejs');
const app = express();

// Template Engine
app.set('view engine', 'ejs');

// burada middleware ile dosyalarımızı statik olarak yükledik
app.use(express.static('public'));

const port = 3000;

// Routing
app.get('/', (req, res) => {
  res.render('index'); // burada index.ejs dosyasını render ediyoruz
});

app.get('/about', (req, res) => {
  res.render('about'); // burada index.ejs dosyasını render ediyoruz
});

app.get('/add', (req, res) => {
  res.render('add');
});
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});

// ejs kullanabilmek için view adlı klasoru oluşturup içine html dosyasalarını kopyalıyoruz
// ve uzantısını .ejs ile değiştiriyoruz
// Ek olarak html deki kop parçalarını parça parça include edebiliriz
// ve kod tekrarını engellemiş oluruz (<%- include(filepath) -%>)
