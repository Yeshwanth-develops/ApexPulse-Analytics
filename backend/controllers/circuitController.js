const axios = require("axios");

// Mapping of circuit IDs to Wikimedia Commons image URLs for F1 circuits
const CIRCUIT_IMAGE_MAP = {
  albert_park: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Albert_Park_Circuit_map.svg/440px-Albert_Park_Circuit_map.svg.png",
  americas: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Circuit_of_the_Americas_map.svg/440px-Circuit_of_the_Americas_map.svg.png",
  bahrain: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Bahrain_International_Circuit_map.svg/440px-Bahrain_International_Circuit_map.svg.png",
  baku: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Baku_City_Circuit_map.svg/440px-Baku_City_Circuit_map.svg.png",
  catalunya: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Barcelona-Catalunya_Circuit_map.svg/440px-Barcelona-Catalunya_Circuit_map.svg.png",
  hungaroring: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Hungaroring_map.svg/440px-Hungaroring_map.svg.png",
  interlagos: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Aut%C3%B3dromo_Jos%C3%A9_Pablo_Amorim_map.svg/440px-Aut%C3%B3dromo_Jos%C3%A9_Pablo_Amorim_map.svg.png",
  jeddah: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Jeddah_Street_Circuit_map.svg/440px-Jeddah_Street_Circuit_map.svg.png",
  marina_bay: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Marina_Bay_Street_Circuit_map.svg/440px-Marina_Bay_Street_Circuit_map.svg.png",
  mexico: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_map.svg/440px-Aut%C3%B3dromo_Hermanos_Rodr%C3%ADguez_map.svg.png",
  monaco: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Circuit_de_Monaco_map.svg/440px-Circuit_de_Monaco_map.svg.png",
  monza: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Autodromo_Nazionale_di_Monza_map.svg/440px-Autodromo_Nazionale_di_Monza_map.svg.png",
  silverstone: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Silverstone_Circuit_map.svg/440px-Silverstone_Circuit_map.svg.png",
  spa: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Circuit_de_Spa-Francorchamps_map.svg/440px-Circuit_de_Spa-Francorchamps_map.svg.png",
  suzuka: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Suzuka_Circuit_map.svg/440px-Suzuka_Circuit_map.svg.png",
  vegas: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Las_Vegas_Grand_Prix_circuit_map.svg/440px-Las_Vegas_Grand_Prix_circuit_map.svg.png",
  red_bull_ring: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Red_Bull_Ring_map.svg/440px-Red_Bull_Ring_map.svg.png",
  yas_marina: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Yas_Marina_Circuit_map.svg/440px-Yas_Marina_Circuit_map.svg.png",
};

function normalizeCircuitId(circuitId) {
  if (!circuitId) return null;
  // Convert to lowercase and replace spaces/hyphens with underscores
  return circuitId.toLowerCase().replace(/[\s\-]/g, "_");
}

exports.getCircuitImage = async (req, res) => {
  try {
    const circuitId = req.params.circuitId;

    if (!circuitId) {
      return res.status(400).json({
        message: "Circuit ID is required",
        fallback: "/circuits/generic.svg",
      });
    }

    const normalizedId = normalizeCircuitId(circuitId);
    console.log(`[Circuit Image] Requested: ${circuitId}, Normalized: ${normalizedId}`);

    // Check if we have a mapped image for normalized ID
    let imageUrl = CIRCUIT_IMAGE_MAP[normalizedId];

    // Fallback: try original ID (without normalizing)
    if (!imageUrl) {
      imageUrl = CIRCUIT_IMAGE_MAP[circuitId];
    }

    // Log result
    if (imageUrl) {
      console.log(`[Circuit Image] Found image for ${normalizedId}`);
    } else {
      console.log(`[Circuit Image] No image found for ${normalizedId}, using fallback`);
    }

    const fallbackUrl = "/circuits/generic.svg";

    res.json({
      circuitId,
      normalizedId,
      imageUrl: imageUrl || fallbackUrl,
      source: imageUrl ? "wikimedia" : "local",
    });
  } catch (error) {
    console.error("[Circuit Image Error]", error.message);
    res.status(500).json({
      message: "Error fetching circuit image",
      fallback: "/circuits/generic.svg",
      normalizedId: null,
      imageUrl: "/circuits/generic.svg",
      source: "local",
    });
  }
};

exports.getAllCircuitImages = async (req, res) => {
  try {
    res.json({
      circuits: CIRCUIT_IMAGE_MAP,
      count: Object.keys(CIRCUIT_IMAGE_MAP).length,
      normalized_keys: Object.keys(CIRCUIT_IMAGE_MAP),
    });
  } catch (error) {
    console.error("Error fetching circuit images:", error.message);
    res.status(500).json({
      message: "Error fetching circuit images",
    });
  }
};
