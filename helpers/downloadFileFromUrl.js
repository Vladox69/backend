const axios = require("axios");

/**
 * Descarga un archivo desde la URL proporcionada por Cloudinary.
 * 
 * @param {string} fileUrl - URL completa (secure_url) del recurso.
 * @returns {Promise<Buffer>} - Contenido del archivo como buffer.
 */
const downloadFileFromUrl = async (fileUrl) => {
  const response = await axios.get(fileUrl, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data); // puedes hacer .toString("utf-8") si necesitas texto
};
module.exports = downloadFileFromUrl;