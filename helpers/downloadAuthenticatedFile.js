const axios = require("axios");
const cloudinary = require("../db/cloudinary");

/**
 * Descarga un archivo `authenticated` desde Cloudinary usando URL firmada.
 * @param {string} publicId - ejemplo: 'facturas/001-001-000000123.xml'
 * @param {string} resourceType - 'raw' para XML/PDF
 * @param {string} format - 'xml' o 'pdf'
 * @returns {Promise<Buffer>}
 */
const downloadAuthenticatedFile = async (publicId, resourceType = "raw", format = "pdf") => {
  const signedUrl = cloudinary.utils.private_download_url(publicId, format, {
    type: "authenticated",
    resource_type: resourceType,
    expires_at: Math.floor(Date.now() / 1000) + 300, // expira en 5 min
  });

  const response = await axios.get(signedUrl, {
    responseType: "arraybuffer",
  });

  return Buffer.from(response.data);
};

module.exports = downloadAuthenticatedFile;
