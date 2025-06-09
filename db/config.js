const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const dbUri = process.env.DATABASE_URL;
    if (!dbUri) {
      throw new Error("DATABASE_URL no está definida en las variables de entorno.");
    }

    await mongoose.connect(dbUri);

    console.log("Base de datos online");
  } catch (error) {
    console.error(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};
