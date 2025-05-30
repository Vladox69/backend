const cloudinary = require('../db/cloudinary');

/**
 * Sube un archivo como string a Cloudinary (recurso tipo RAW).
 * 
 * @param {string} fileString - Contenido del archivo (por ejemplo XML).
 * @param {string} folder - Carpeta dentro de Cloudinary (ej: 'facturas').
 * @param {string} publicId - Nombre del archivo (sin extensión).
 * @param {string} format - Formato del archivo ('xml', 'pdf', etc.).
 * @returns {Promise<object>} - Resultado de Cloudinary (incluye secure_url).
 */
const uploadToCloudinary = async (fileString, folder, publicId, format = "xml") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `${folder}/${publicId}`,
        format,
        overwrite: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(Buffer.from(fileString, "utf-8"));
  });
};

module.exports = uploadToCloudinary;
