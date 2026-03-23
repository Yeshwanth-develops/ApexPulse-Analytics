// routes/circuit.js (or wherever your routes live)
const express = require('express');
const router = express.Router();
const {
  getCircuitImage,
  getCircuitImageProxy,
  getAllCircuitImages
} = require('../controllers/circuitImage'); // your controller path

router.get('/circuit-image/:circuitId', getCircuitImage);
router.get('/circuit-image-proxy/:circuitId', getCircuitImageProxy);
router.get('/circuit-images', getAllCircuitImages);

module.exports = router;
