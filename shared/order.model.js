import mongoose from 'mongoose';
const { Schema } = mongoose;

// Order model
const orderSchema = new Schema({
    item: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Pending','Processed','Failed'], default: 'Pending' },
    index: { type: Number, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);