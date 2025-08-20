import mongoose from 'mongoose';
const { Schema, model } = mongoose;

// Order model
const orderSchema = new Schema({
    item: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Pending','Processed','Failed'], default: 'Pending' }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;