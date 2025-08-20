import amqp from 'amqplib';

// Setting exchange name
const EXCHANGE = 'orders';

//Setting binding Key
const BINDING_KEY = 'orders.create';

const DEFAULT_QUEUE = 'orders';


export default async function publish(url, {queue = DEFAULT_QUEUE, payload}) {
    let connection
    let channel

    if (!payload) throw new Error('payload is required');

    try{
        //Creating a channle for RabbitMQ
        connection = await amqp.connect(url);
        channel = await connection.createChannel();

        //Using direct exchange
        await channel.assertExchange(EXCHANGE, 'direct', { durable: true });
        
         // Ensure the queue exists
        await channel.assertQueue(queue, { durable: true });
        
        //Binding queue
        await channel.bindQueue(queue, EXCHANGE, BINDING_KEY);

        //Publish the message to the "orders" exchange
        channel.publish(EXCHANGE, BINDING_KEY, Buffer.from(JSON.stringify(payload)), { persistent: true });
        
        console.log('[RabbitMQ] Message published');
    } catch(error){
        console.error('[RabbitMQ] Failed to publish message:', error);
    } finally{
        //Closing the channel if it exists
        if (channel) {
            try { await channel.close(); } catch {}
          }
        //Closing the connection if it existsx
        if (connection) {
            try { await connection.close(); } catch {}
          }
    }
}

