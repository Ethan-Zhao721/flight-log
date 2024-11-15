"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Database connection URI (can be stored in .env file)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/flightLogs';
// Function to connect to the MongoDB database
const connectDB = async () => {
    try {
        // Connect to MongoDB using Mongoose
        await mongoose_1.default.connect(MONGO_URI);
        console.log('MongoDB connected');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process if connection fails
    }
};
// Export the connection function
exports.default = connectDB;
//# sourceMappingURL=db.js.map