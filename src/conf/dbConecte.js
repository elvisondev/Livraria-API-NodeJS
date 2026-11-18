import mongoose from "mongoose";

async function connectDataBase() {
 await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection;
}

export default connectDataBase;
