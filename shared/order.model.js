import mongoose from 'mongoose';
const { Schema, model } = mongoose;

/** Schema for customer orders stored in MongoDB.
*   Tracks the item name, quantity ordered, and current status.
*   Automatically includes createdAt and updatedAt timestamps.
*/
const orderSchema = new Schema({
    item: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: ['Pending','Processed','Failed'], default: 'Pending' }
}, { timestamps: true });

// Define Order model mapped to the orders collection using orderSchema
const Order = mongoose.model('Order', orderSchema);

export default Order;