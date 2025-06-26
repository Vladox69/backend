const path = require("path");

/**
 * Extrae el publicId desde una URL de Cloudinary authenticated.
 * @param {string} url - La URL completa
 * @returns {object} { publicId, format }
 */
const extractPublicIdFromUrl = (url) => {
  const parsed = new URL(url);
  const parts = parsed.pathname.split("/");

  // Ej: /raw/authenticated/v1719274814/facturas/001-001-000000123.xml
  const filename = parts[parts.length - 1]; // 001-001-000000123.xml
  const format = path.extname(filename).slice(1); // xml
  const name = path.basename(filename, `.${format}`); // 001-001-000000123

  const publicId = parts.slice(4, parts.length - 1).concat(name).join("/");

  return { publicId, format };
};

module.exports = extractPublicIdFromUrl;
