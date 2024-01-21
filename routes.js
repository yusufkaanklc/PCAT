// routes.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const Photo = require('./models/Photo');

// Ana sayfa rota tanımı
router.get('/', async (req, res) => {
  try {
    // Tüm fotoğrafları veritabanından al
    const photos = await Photo.find({});
    res.render('index', { photos });
  } catch (error) {
    console.error(error);
    res.status(500).send('Sunucu hatası');
  }
});

// Hakkında sayfası rota tanımı
router.get('/about', (req, res) => {
  // Hakkında sayfasını render et
  res.render('about');
});

// Fotoğraf ekleme sayfası rota tanımı
router.get('/add', (req, res) => {
  // Fotoğraf ekleme sayfasını render et
  res.render('add');
});

// Fotoğraf ekleme endpoint'i
router.post('/photos', async (req, res) => {
  try {
    const uploadDir = 'public/uploads';

    // Upload dizini kontrolü
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Yüklenen resmi al
    const uploadedImage = req.files && req.files.image;

    // Eğer resim yoksa hata döndür
    if (!uploadedImage) {
      return res.status(400).send('Dosya bulunamadı');
    }

    // Resim yükleme yolu
    const uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

    // Resmi kaydet
    await uploadedImage.mv(uploadPath);

    // Veritabanına fotoğrafı ekle
    await Photo.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });

    res.redirect('/');
  } catch (error) {
    // Hata durumunda logla ve hata mesajını gönder
    console.log('Veri kaydetme hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

// Tekil fotoğraf görüntüleme sayfası rota tanımı
router.get('/photos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fotoğrafı id'ye göre bul
    const photo = await Photo.findById(id);
    res.render('photo', { photo });
  } catch (error) {
    console.log('Veri getirme hatası:', error);
  }
});

// Fotoğraf düzenleme sayfası rota tanımı
router.get('/photos/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fotoğrafı id'ye göre bul
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).send('Fotoğraf bulunamadı');
    }

    // Düzenleme sayfasını render et
    res.render('edit', { photo });
  } catch (error) {
    console.log('Veri getirme hatası:', error);
    return res.status(500).send('Sunucu hatası');
  }
});

// Fotoğraf düzenleme endpoint'i
router.put('/photos/edit/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Fotoğrafı id'ye göre bul
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).send('Fotoğraf bulunamadı');
    }

    const uploadDir = 'public/uploads';

    // Upload dizini kontrolü
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    let uploadedImage;

    // Eğer yeni bir resim yüklendiyse
    if (req.files && req.files.image) {
      uploadedImage = req.files.image;

      const uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

      // Yeni resmi kaydet
      uploadedImage.mv(uploadPath, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err);
        }
      });
    }

    // Güncellenecek veriler
    const updatedData = {
      ...req.body,
      ...(uploadedImage && { image: '/uploads/' + uploadedImage.name }),
    };

    // Fotoğrafı güncelle
    await Photo.findByIdAndUpdate(id, updatedData);

    // Eğer eski resim değiştiyse, eski resmi sil
    if (uploadedImage && photo.image !== updatedData.image) {
      const oldImagePath = __dirname + '/public' + photo.image;

      // Eğer eski resim kullanılmıyorsa sil
      if (!(await Photo.findOne({ image: oldImagePath }))) {
        console.log('Eski resim silindi');
        fs.unlinkSync(oldImagePath);
      }
    }

    res.redirect('/');
  } catch (error) {
    console.log('Veri güncelleme hatası:', error);
    return res.status(500).send('Sunucu hatası');
  }
});

// Fotoğraf silme endpoint'i
router.delete('/photos/delete/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fotoğrafı id'ye göre bul
    let data = await Photo.findById(id);

    // Eğer fotoğraf varsa ve bir resim bağlantısı varsa, resmi sil
    if (data && data.image) {
      const oldImagePath = __dirname + '/public' + data.image;

      // Eğer eski resim varsa sil
      if (fs.existsSync(oldImagePath)) {
        console.log('Eski resim silindi');
        fs.unlinkSync(oldImagePath);
      } else {
        console.log('Eski resim bulunamadı');
      }
    }

    // Fotoğrafı sil
    await Photo.findByIdAndDelete(id);

    res.redirect('/');
  } catch (error) {
    console.error('Silme hatası:', error);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = router;
