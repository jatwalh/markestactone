import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import './config/db';

// Import routers (adjust the import paths if needed)
import airportRouter from "./routers/airports/airports.router"
import { getAirportsNearCityRender } from "./controllers/airports/airports.ejs.controller"

// Middleware
const app: Application = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, '../src/views'));


// Routes
app.use('/airports', airportRouter);

// Route address
app.get('/', getAirportsNearCityRender);



export default app;