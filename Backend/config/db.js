import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/QuickGPT`);
    } catch (error) {
        console.error(error.message);
    }
};

export default connectDB;
