import mongoose from "mongoose";

const connectMongoDB = async()=>{
  try {
    await mongoose.connect("mongodb+srv://coderbackend:coderpass@coderback-1curso.3ivzwek.mongodb.net/myEcommerce?appName=coderBack-1curso");
    console.log("Conectado con MongoDB")
  } catch (error) {
    console.log("Error al conectar con MongoDB")
  }
};

export default connectMongoDB