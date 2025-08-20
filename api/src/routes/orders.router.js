const express = require('express');
const order = require('../../shared/order.model');
const publish = require('../rabbit.publish');

const router = express.Router();
const RABBITMQ_URL = process.env.RABBITMQ_URL;

function validateRequest(body){
    //Reject bodyless requests
    if(!body) return "Request body missing"

    //Reject empty, or non-string 'item' values
    if(body.item.trim() == '' || typeof body.item != "string")
        return "item must be a non-empty string"

    // Validate that quantity is a positive integer
    if(!Number.isInteger(body.quantity) || body.quantity <= 0)
        return 'quantity must be > 0';

    //Return null if all OK
    return null;
}

// POST /orders
// Validates the request body, creates a new order with default "Pending" status,
// attempts to publish the order to RabbitMQ (logs error if publish fails but does not block),
// and returns the created order details as JSON.
router.post('/', async (req, res) => {
    //Check for error in the request body
    const err = validateRequest(req.body);
    //Return error code 400 - Bad request
    if(err) return res.status(400).json({error: err});

    const { item, quantity } = req.body;

    //Save order in MongoDB
    const currOrder = await order.create({ item, quantity, status: 'Pending'}); 

    try {
        //Trying to publish to RabbitMQ
        await publish(RABBITMQ_URL, { orderId: String(order._id), item, quantity });
      } catch (err) {
        console.error('[API] publish failed:', err.message);
      }
    
    //Sending resonse to the client (201 - Created)
    res.status(201).json({
        id: String(order._id),
        item: order.item,
        quantity: order.quantity,
        status: order.status,
        createdAt: order.createdAt
      });
});