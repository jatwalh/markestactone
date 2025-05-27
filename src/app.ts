import express, { Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import cookieParser from 'cookie-parser';
import './config/db';


// Import routers (adjust the import paths if needed)
import airportRouter from "./routers/airports/airports.router"
import { Airport } from './models/airports/airports.model';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// // Routes
app.use('/airports', airportRouter);



// app.use("/hello", async function updateOldAirports() { 


//   const airports = await Airport.find({
//     location: { $exists: false }
//   });

//   for (const airport of airports) {
//     if (airport.longitude && airport.latitude) {
//       airport.location = {
//         type: 'Point',
//         coordinates: [airport.longitude, airport.latitude]
//       };
//       await airport.save();
//       console.log(`Updated: ${airport.name}`);
//     }
//   }

//   console.log('Finished updating old airport documents.');

// }
// );


export default app;