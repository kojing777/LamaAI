import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Database connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected');
        });

        const conn = await mongoose.connect(`${process.env.MONGODB_URI}/QuickGPT`, {
            // Modern connection options (these are now defaults in newer versions)
        });

    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

export default connectDB;