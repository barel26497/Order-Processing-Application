import mongoose from 'mongoose';

/**
 * Connect to MongoDB using MONGO_URL from environment variables.
 * Throws an error if MONGO_URL is missing or the connection fails.
 */
async function connect() {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error('[API] MONGO_URL is missing');
      }

    try {
        await mongoose.connect(url, { dbName: 'ordersdb' });
        console.log('API Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting API to MongoDB:', error);
        throw error;
    }
} 

export default connect;
