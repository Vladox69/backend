const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    console.log(process.env.DATABASE_URL);
    
    await mongoose.connect(process.env.DATABASE_URL, {});
    console.log("Base de datos online");
  } catch (error) {
    console.log(error);
    throw new Error("Error a la hora de iniciar la base de datos");
  }
};

module.exports = {
  dbConnection,
};