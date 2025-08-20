import {Router} from 'express';
import order from '../../shared/order.model.js';
import publish from '../rabbit.publish.js';

const router = Router();
const RABBITMQ_URL = process.env.RABBITMQ_URL;

function validateRequest(body){
    //Reject bodyless requests
    if(!body) return "Request body missing"

    //Reject empty, or non-string 'item' values
    if(typeof body.item != "string" || body.item.trim() == '')
        return "item must be a non-empty string"

    // Validate that amount is a positive integer
    if(!Number.isInteger(body.amount) || body.amount <= 0)
        return 'amount must be > 0';

    //Return null if all OK
    return null;
}

/** POST /orders
* Validates the request body, creates a new order,
* attempts to publish the order to RabbitMQ,
* and returns the created order details as JSON.
*/
router.post('/', async (req, res) => {
    //Check for error in the request body
    const err = validateRequest(req.body);
    //Return error code 400 - Bad request
    if(err) return res.status(400).json({error: err});

    const { item, amount } = req.body;

    //Save order in MongoDB
    const currOrder = await order.create({ item, amount, status: 'Pending'}); 

    try {
        //Trying to publish to RabbitMQ
        await publish(RABBITMQ_URL, {
          routingKey: 'orders',
          payload: { orderId: String(currOrder._id), item, amount }
        });
      } catch (err) {
        console.error('[API] publish failed:', err.message);
      }
    
    //Sending resonse to the client (201 - Created)
    res.status(201).json({
        id: String(currOrder._id),
        item: currOrder.item,
        amount: currOrder.amount,
        status: currOrder.status,
        createdAt: currOrder.createdAt
      });
});

/**
 * GET /
 * Fetch all orders from the database.
 * Orders are sorted by newest first.
 */
router.get('/', async (_req, res) => {
  //Fetch all orders sorted by newest first, return as plain JS object
  const orders = await order.find().sort({ createdAt: -1 }).lean();
  res.json(
    orders.map(({ _id, ...rest }) => ({
      id: String(_id),
      ...rest
    }))
  );
});

/**
 * GET /:id
 * Fetch a single order by its MongoDB ObjectId.
 * Returns 404 if the order is not found.
 */
router.get('/:id', async (req, res) => {
  const obj = await Order.findById(req.params.id).lean();
  if (!obj) return res.status(404).json({ error: 'Item Not found' });
  res.json({ id: String(obj._id), ...obj });
});

export default router;
