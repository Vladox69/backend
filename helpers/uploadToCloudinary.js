const cloudinary = require('../db/cloudinary');

/**
 * Subir archivo RAW a Cloudinary.
 * @param {string} fileString - Contenido del archivo (XML, etc.).
 * @param {string} folder - Carpeta de Cloudinary.
 * @param {string} publicId - Nombre del archivo sin extensión.
 * @param {string} format - Formato del archivo (xml, pdf, etc.).
 * @returns {Promise<object>} - Resultado de Cloudinary.
 */
const uploadToCloudinary = async (fileString, folder, publicId, format = "xml") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        public_id: `${folder}/${publicId}`,
        format,
        overwrite: true,
        type: "authenticated",
      },
      (error, result) => {
        if (error) {
          console.error("Error al subir a Cloudinary:", error);
          return reject(new Error(`Cloudinary error: ${error.message}`));
        }
        if (!result) {
          console.error("No se obtuvo resultado al subir el archivo");
          return reject(new Error("No se obtuvo resultado al subir el archivo"));
        }
        resolve(result); // Devolver el resultado si no hay error
      }
    );

    try {
      stream.end(Buffer.from(fileString, "utf-8"));
    } catch (error) {
      console.error("Error al procesar el archivo para subir:", error);
      reject(new Error("Error al procesar el archivo para subir"));
    }
  });
};

module.exports = uploadToCloudinary;
