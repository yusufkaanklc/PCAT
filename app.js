const express = require('express');

const app = express();

// middleware istek cevap döngüsünün arasında ek işlemler yapmak için kullanılır

// const myLogger = (req, res, next) => {
//   console.log('Middleware Log 1');
//   next(); // next ile bir sonraki middleware çalışır
// };

// app.use(myLogger);

app.use(express.static('public')); // burada middleware ile dosyalarımızı statik olarak yükledik

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const soru = (quest) => {
  return new Promise((resolve, reject) => {
    rl.question(quest, (answer) => {
      if (!answer) {
        console.log('Boş bırakılamaz. Tekrar giriniz:');
        soru(quest).then(resolve);
      } else {
        resolve(answer);
      }
    });
  });
};

const server = (data, endpoint) => {
  return new Promise((resolve, reject) => {
    if (endpoint) {
      app.get(`/${endpoint}`, (req, res) => {
        res.status(200).set({ 'Content-Type': 'text/plain' }).send(data);
      });

      app.get('/', (req, res) => {
        res.status(200).set({ 'Content-Type': 'text/html' });
        const photo = {
          id: 1,
          name: 'photo name',
          desc: 'photo description',
        };
        res.send(photo);
      });

      app.listen(port, () => {
        console.log(`Server ${port} portunda çalışıyor`);
      });
      resolve();
    } else {
      reject('Endpoint yok');
    }
  });
};

const main = async () => {
  try {
    const data = await soru('İçerik giriniz:');
    const endpoint = await soru('Endpoint giriniz:');

    await server(data, endpoint);
  } catch (error) {
    console.error(error);
  } finally {
    rl.close();
  }
};

main();
