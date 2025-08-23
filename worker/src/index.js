import amqp from 'amqplib';
import connect from './db.connect.js';
import Order from '../shared/order.model.js';

// Setting exchange name
const EXCHANGE = 'orders';

//Setting binding Key
const BINDING_KEY = 'orders.create';

const DEFAULT_QUEUE = 'orders';

/**
 * wait
 * Return a Promise that resolves after the given time in ms.
 */
function wait(time){
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * prepareRabbitChannel
 * Setup RabbitMQ channel with exchange, queue, and binding.
 * Ensures durability and sets prefetch to 1.
 */
async function prepareRabbitChannel(channel){
    await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
    await channel.assertQueue(DEFAULT_QUEUE, { durable: true });
    await channel.bindQueue(DEFAULT_QUEUE, EXCHANGE, BINDING_KEY);

    //Tell RabbitMQ to Send only ONE message at a time to the worker.
    channel.prefetch(1);
}

/**
 * consumeMessage
 * Process a message from RabbitMQ: parse, simulate work, update order status.
 * Acknowledge on success; send negative ack if processing fails.
 */
async function consumeMessage(channle, msg){
    //if there is no message, exit method
    if(!msg) return;
    try{
        const { orderId } = JSON.parse(msg.content.toString());

        //Simulate 2 sec proccessing
        await wait(2000);

        //Updating the status of the order
        await Order.findByIdAndUpdate(orderId, { status: 'Processed' });

        //Sending acknowledgement to RabbitMQ
        channle.ack(msg);
    }catch(error){
        console.error('[Worker] failed to process order: ', error);
        //Sending negative ack to RabbitMQ broker
        channle.nack(msg, false, false);
    }
}

/**
 * setupShutdown
 * Gracefully close the RabbitMQ channel and connection on process exit.
 * Handles SIGINT (Ctrl+C) and SIGTERM (Docker stop).
 */
function setupShutdown(connection, channel){
    async function shutdown() {
        try{
            await channel.close();
        } catch (error){
            console.warn('[worker] channel close failed:', error);
        }

        try{
            await connection.close();
        } catch(error){
            console.warn('[worker] connection close failed:', error);
        }
        process.exit(0);
    }
    //Handling ctrl + C signal
    process.once('SIGINT', shutdown);

    //Handling signal sent when Docker stops
    process.once('SIGTERM', shutdown);
}

/**
 * handleFatalError
 * Log a fatal error and exit the worker process with code 1.
 */
function handleFatalError(error) {
    console.error('[worker] fatal error: ', error);
    process.exit(1);
}

/**
 * start
 * Connects to MongoDB and RabbitMQ, prepares the channel, and begins consuming messages.
 * Registers shutdown handling for clean exit.
 */
async function start(){
    await connect();
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await prepareRabbitChannel(channel);
    console.log('[worker] consuming from queue:', DEFAULT_QUEUE);
    await channel.consume(DEFAULT_QUEUE, consumeMessage.bind(null, channel), { noAck: false });
    setupShutdown(connection, channel);
}

//Start the worker and handle any fatal startup errors.
start().catch(handleFatalError);