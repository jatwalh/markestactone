import { Router } from 'express';
// created router here
const airportRouter = Router();


// import file of simple api routes
import {
    addAirports, addSingleAirport, getAllAirports, countriesWithCities,
    getAirportsByCountry, getAirportsNearCityApiUrl, getCitiesbyCountry
} from '../../controllers/airports/airports.controller';

// import file of ejs temp render 
import { getAllAirportsRender } from '../../controllers/airports/airports.ejs.controller';





// simple api routes 
airportRouter.post('/create', addAirports); //http://localhost:3000/airports/create

airportRouter.post('/createsingle', addSingleAirport); // http://localhost:3000/airports/createSingle

airportRouter.get('/findall', getAllAirports); // http://localhost:3000/airports/findall

airportRouter.get('/findairport/:country', getAirportsByCountry); // http://localhost:3000/airports/findairport/india

airportRouter.get('/countrieswithcities', countriesWithCities); // http://localhost:3000/airports/countrieswithcities

airportRouter.get('/get-cities', getCitiesbyCountry); // http://localhost:3000/airports/get-cities

airportRouter.get('/nearby', getAirportsNearCityApiUrl);
// http://localhost:3000/airports/nearby?city=Ambala&country=India





// ejs temp render routes
airportRouter.get('/search', getAllAirportsRender);     // http://localhost:3000/airports/search





export default airportRouter;