const axios = require("axios");

/**
 * Descarga un archivo RAW desde Cloudinary a partir de su public_id.
 * 
 * @param {string} publicId - Ruta completa del archivo (ej: 'facturas/001-001-000000123.xml')
 * @returns {Promise<Buffer>} - Contenido del archivo como buffer.
 */
const downloadFromCloudinary = async (publicId) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  const url = `https://res.cloudinary.com/${cloudName}/raw/upload/${publicId}`;

  const response = await axios.get(url, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data); // Puedes usar toString('utf-8') si necesitas texto
};

module.exports = downloadFromCloudinary;
