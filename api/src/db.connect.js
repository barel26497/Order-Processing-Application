const mongoose = require('mongoose');

//Helper method for connecting to MongoDB
async function connect() {
    const url = process.env.MONGO_URL;
    if (!url) {
        throw new Error('MONGO_URL is missing');
      }

    try {
        await mongoose.connect(url, { dbName: 'ordersdb' });
        console.log('API Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting API to MongoDB:', error);
    }
} 

module.exports = connect;