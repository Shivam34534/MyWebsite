import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Use MONGODB_URL if provided for testing; fallback to local MongoDB
        const baseUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017";

        mongoose.connection.on("connected", () =>
            console.log("Database connected")
        );

        await mongoose.connect(baseUrl, {
            dbName: 'Aura',
            maxPoolSize: 10, // Increase pool for higher concurrency
            serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
    } catch (error) {
        console.log("MongoDB connection error:", error.message);
    }
};

export default connectDB;