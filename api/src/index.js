import express from 'express';
import cors from 'cors';

import connect from './db.connect.js';
import orders from './routes/orders.router.js'

async function start(){
    try{
        //Waiting for DB connection
        await connect();

        //Create Express app
        const app = express();

        //Allowing the front-end to call the API
        app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

        //parse JSON request body into req.body
        app.use(express.json());
        
        //Mount routes
        app.use('/orders', orders);

        //Start listening
        const port = Number(process.env.PORT || 3001);
        app.listen(port, () => console.log(`[API] listening on :${port}`));
    } catch(error){
        console.error('[api] failed to start:', error);
        process.exit(1);
    }
};

start();