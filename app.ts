import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import './config/db';


// Import routers (adjust the import paths if needed)
// import userRouter from './router/user.router';
// import prodRouter from './router/product/product.router';
// import orderRouter from './router/orders/orders.router';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// // Routes
// app.use('/user', userRouter);
// app.use('/product', prodRouter);
// app.use('/orders', orderRouter);


app.use("/", (req, res) => {
  res.send("hello");
});


export default app;