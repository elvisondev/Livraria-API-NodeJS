import mongoose from 'mongoose'


async function connectDataBase() {
  mongoose.connect(process.env.MONGODB_URI)
  return mongoose.connection
}

export default connectDataBase


