const express = require('express');

const app = express();

const port = 3000;

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
  console.log(`Sunucu ${port} portunda çalışıyor`);
});
