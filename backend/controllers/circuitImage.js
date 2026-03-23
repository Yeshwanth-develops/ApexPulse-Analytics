// F1 Circuit Diagrams from Wikipedia (SVG format)
const CIRCUIT_IMAGE_MAP = {
  'albert_park': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Albert_Park_Circuit_2021.svg',
  'shanghai': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Shanghai_International_Racing_Circuit_track_map.svg/500px-Shanghai_International_Racing_Circuit_track_map.svg.png',
  'bahrain': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Bahrain_International_Circuit--Grand_Prix_Layout.svg',
  'jeddah': 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Jeddah_Street_Circuit_2021.svg',
  'miami': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Hard_Rock_Stadium_Circuit_2022.svg/500px-Hard_Rock_Stadium_Circuit_2022.svg.png',
  'imola': 'https://upload.wikimedia.org/wikipedia/commons/2/22/Imola_2009.svg',
  'monaco': 'https://upload.wikimedia.org/wikipedia/commons/3/36/Monte_Carlo_Formula_1_track_map.svg',
  'spain': 'https://upload.wikimedia.org/wikipedia/commons/8/87/Circuit_de_Catalunya_moto_2021.svg',
  'canada': 'https://upload.wikimedia.org/wikipedia/commons/f/f9/%C3%8Ele_Notre-Dame_%28Circuit_Gilles_Villeneuve%29.svg',
  'austria': 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Spielberg_bare_map_numbers_contextless_2021_corner_names.svg',
  'silverstone': 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Silverstone_Circuit_2020.png',
  'hungary': 'https://upload.wikimedia.org/wikipedia/commons/9/91/Hungaroring.svg',
  'belgian': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Spa-Francorchamps_of_Belgium.svg/1280px-Spa-Francorchamps_of_Belgium.svg.png',
  'dutch': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Zandvoort_Circuit.png/1280px-Zandvoort_Circuit.png',
  'italy': 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Monza_track_map.svg',
  'baku': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Baku_Formula_One_circuit_map.svg/1280px-Baku_Formula_One_circuit_map.svg.png',
  'singapore': 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Marina_Bay_circuit_2023.svg',
  'usa': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Austin_circuit.svg',
  'mexico': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez.svg',
  'sao_paulo': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Aut%C3%B3dromo_Jos%C3%A9_Carlos_Pace.svg',
  'las_vegas': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Las_Vegas_Strip_Circuit.svg',
  'qatar': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Lusail_International_Circuit.svg',
  'abu_dhabi': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Yas_Marina_Circuit.svg',

  // Alias entries for 2026 names / alternate IDs
  'madring': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/15-Monza/MON.png.transform/1x1/image.png',
  'marina_bay': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/17-Singapore/SIN.png.transform/1x1/image.png',
  'americas': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/18-USA/USA.png.transform/1x1/image.png',
  'rodriguez': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/19-Mexico/MEX.png.transform/1x1/image.png',
  'interlagos': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/20-SaoPaulo/BRZ.png.transform/1x1/image.png',
  'vegas': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/21-LasVegas/LVS.png.transform/1x1/image.png',
  'losail': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/22-Qatar/QAT.png.transform/1x1/image.png',
  'yas_marina': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/23-AbuDhabi/YAS.png.transform/1x1/image.png',
  'catalunya': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/8-Barcelona/BAR.png.transform/1x1/image.png',
  'villeneuve': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/9-Montreal/CAN.png.transform/1x1/image.png',
  'red_bull_ring': 'https://media.formula1.com/content/dam/fom-website/2025/championship/circuits/10-Austria/AUT.png.transform/1x1/image.png',
  'suzuka': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Suzuka_circuit_map--2005.svg/500px-Suzuka_circuit_map--2005.svg.png'
};

function normalizeCircuitId(circuitId) {
  if (!circuitId) return null;
  return circuitId.toLowerCase().replace(/[\s\-]/g, '_');
}

exports.getCircuitImage = async (req, res) => {
  try {
    const circuitId = req.params.circuitId;
    
    if (!circuitId) {
      return res.status(400).json({ 
        message: "Circuit ID is required",
        fallback: "/circuits/generic.svg"
      });
    }

    const normalizedId = normalizeCircuitId(circuitId);
    console.log(`[Circuit Photo] Requested: ${circuitId}, Normalized: ${normalizedId}`);

    const originalImageUrl = CIRCUIT_IMAGE_MAP[normalizedId] || CIRCUIT_IMAGE_MAP[circuitId];
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const proxiedImageUrl = originalImageUrl
      ? `${baseUrl}/api/circuit-image-proxy/${encodeURIComponent(normalizedId)}`
      : `${baseUrl}/circuits/generic.svg`;

    console.log(`[Circuit Photo] ${originalImageUrl ? '✅ Found' : '❌ No photo for'} ${normalizedId}`);

    res.json({
      circuitId,
      normalizedId,
      imageUrl: proxiedImageUrl,
      source: originalImageUrl ? "proxy" : "placeholder",
      originalImageUrl: originalImageUrl || null
    });

  } catch (error) {
    console.error("[Circuit Photo Error]", error.message);
    res.status(500).json({
      message: "Server error",
      imageUrl: "/circuits/generic.svg",
      source: "placeholder"
    });
  }
};

exports.getCircuitImageProxy = async (req, res) => {
  try {
    const circuitId = req.params.circuitId;
    if (!circuitId) {
      return res.status(400).json({ message: "Circuit ID is required" });
    }

    const normalizedId = normalizeCircuitId(circuitId);
    const remoteUrl = CIRCUIT_IMAGE_MAP[normalizedId] || CIRCUIT_IMAGE_MAP[circuitId];

    if (!remoteUrl) {
      return res.sendFile(require('path').join(__dirname, '..', 'public', 'circuits', 'generic.svg'), (err) => {
        if (err) {
          console.error('[Circuit Photo Fallback Error]', err.message);
          res.status(404).json({ message: 'Fallback image not found' });
        }
      });
    }

    const axios = require('axios');
    const response = await axios.get(remoteUrl, {
      responseType: 'stream',
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.formula1.com/'
      }
    });

    res.set('Content-Type', response.headers['content-type'] || 'image/png');
    res.set('Cache-Control', 'public, max-age=86400');
    response.data.pipe(res);
  } catch (error) {
    console.error('[Circuit Photo Proxy Error]', error.message);
    // Send generic.svg as fallback image instead of JSON
    res.sendFile(require('path').join(__dirname, '..', 'public', 'circuits', 'generic.svg'));
  }
};

exports.getAllCircuitImages = async (req, res) => {
  try {
    res.json({
      circuits: CIRCUIT_IMAGE_MAP,
      count: Object.keys(CIRCUIT_IMAGE_MAP).length,
      source: "Formula 1 Official"
    });
  } catch (error) {
    console.error("Error fetching circuit photos:", error.message);
    res.status(500).json({ message: "Error fetching circuit photos" });
  }
};
