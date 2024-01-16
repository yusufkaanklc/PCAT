const express = require('express');
const readline = require('readline');

const port = 3000;

const app = express();

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
        res.redirect(`/${endpoint}`);
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
