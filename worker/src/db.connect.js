import mongoose from 'mongoose';

//Helper method for connecting worker to MongoDB
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
