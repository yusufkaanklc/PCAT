const express = require('express');
const path = require('path');
const app = express();

// middleware istek cevap döngüsünün arasında ek işlemler yapmak için kullanılır

// const myLogger = (req, res, next) => {
//   console.log('Middleware Log 1');
//   next(); // next ile bir sonraki middleware çalışır
// };

// app.use(myLogger);

// app.use(express.static('public')); burada middleware ile dosyalarımızı statik olarak yükledik

const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'));
});

app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
