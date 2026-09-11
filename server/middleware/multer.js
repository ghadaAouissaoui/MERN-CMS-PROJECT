const multer = require("multer");

const storage = multer.memoryStorage(); // ou diskStorage si tu veux sauvegarder les images

const upload = multer({ storage });

module.exports = upload;
