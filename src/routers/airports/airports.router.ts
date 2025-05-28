import { Router } from 'express';
import {
    addAirports, addSingleAirport, getAllAirports, countriesWithCities,
    getAirportsByCountry, getAirportsNearCityApiUrl
} from '../../controllers/airports/airports.controller';

const airportRouter = Router();

airportRouter.post('/create', addAirports); //http://localhost:3000/airports/create

airportRouter.post('/createsingle', addSingleAirport); // http://localhost:3000/airports/createSingle

airportRouter.get('/findall', getAllAirports); // http://localhost:3000/airports/findall

airportRouter.get('/findairport/:country', getAirportsByCountry); // http://localhost:3000/airports/findairport/india

airportRouter.get('/countrieswithcities', countriesWithCities); // http://localhost:3000/airports/countrieswithcities

airportRouter.get('/nearby', getAirportsNearCityApiUrl); 
// http://localhost:3000/airports/nearby?city=Ambala&country=India




export default airportRouter;