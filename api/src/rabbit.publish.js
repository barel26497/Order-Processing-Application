import amqp from 'amqplib';

// Setting exchange name
const EX = 'orders';
//Setting binding Key
const BK = 'orders.create';

async function publish(url, payload) {
    let connection
    let channel

    try{
        //Creating a channle for RabbitMQ
        connection = await amqp.connect(url);
        channel = await connection.createChannel();

        //Using direct exchange
        await ch.assertExchange(EX, 'direct', { durable: true });
        
        //Publish the message to the "orders" exchange
        ch.publish(EX, RK, Buffer.from(JSON.stringify(payload)), { persistent: true });
        
        console.log('[RabbitMQ] Message published');
    } catch(error){
        console.error('[RabbitMQ] Failed to publish message:', error);
    } finally{
        //Closing the channel if it exists
        if (channel) await ch.close().catch(() => {});
        //Closing the connection if it exists
        if (conn) await conn.close().catch(() => {});
    }
}

module.exports = { publish, EX, BK };

