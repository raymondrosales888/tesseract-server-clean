const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const Tesseract = require('tesseract.js');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(fileUpload());
app.use(express.static('public'));

app.post('/ocr', async (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('No image file uploaded.');
  }
  try {
    const image = req.files.image;
    const result = await Tesseract.recognize(image.data, 'eng', {
      logger: m => console.log(m)
    });
    res.send({ text: result.data.text });
  } catch (error) {
    res.status(500).send('OCR processing failed.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
