import mongoose from 'mongoose';

/**
 * connect
 * Connects the worker service to MongoDB using MONGO_URL from environment variables.
 * Throws an error if the URL is missing or the connection fails.
 */
async function connect() {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error('[Worker] MONGO_URL is missing');
      }

    try {
        await mongoose.connect(url, { dbName: 'ordersdb' });
        console.log('Worker Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting worker to MongoDB:', error);
        throw error;
    }
} 

export default connect;
