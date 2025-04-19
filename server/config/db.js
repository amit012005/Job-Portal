import mongoose from "mongoose";

//Function to connect to the database
const connectDB = async () => {
    //Check if the environment variable is set
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected');
    })
    await mongoose.connect(`${process.env.MONGODB_URI}`)
}
export default connectDB;