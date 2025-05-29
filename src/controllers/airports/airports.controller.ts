import { Request, Response } from 'express';
import { Airport } from "../../models/airports/airports.model";
import axios from 'axios';
import * as XLSX from 'xlsx';
import { getCoordinatesFromCity, fetchCoordinates } from "../../Utils/utils"

interface AirportRow {
    name: string;
    iata: string;
    city: string;
    country: string;
    isInternational?: boolean;
}

const workbook = XLSX.readFile('./bOne.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json<AirportRow>(sheet);


// get the nearest airport by just enter city and country
export const getAirportsNearCityApiUrl = async (req: Request, res: Response): Promise<void> => {
    try {
        let { city, country } = req.query;

        if (!city || !country) {
            res.status(400).json({ message: 'City and country are required.' });
            return;
        }

        city = (city as string).trim().toLowerCase();
        country = (country as string).trim().toLowerCase();

        const { latitude, longitude } = await getCoordinatesFromCity(city, country);
        if (!latitude || !longitude) {
            res.status(404).json({ message: 'Could not find coordinates for the specified city and country.' });
            return;
        }

        const nearbyAirports = await Airport.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    distanceField: 'distanceInMeters',
                    spherical: true,
                    query: { country: country },
                    maxDistance: 300000 // serach in 300 kms of area 
                }
            },
            {
                $sort: { distanceInMeters: 1 }
            },
            {
                $limit: 5
            }
        ]);

        if (!nearbyAirports.length) {
            res.status(404).json({ message: 'No nearby airports found.' });
            return;
        }

        res.status(200).json({ data: nearbyAirports });
    } catch (error: any) {
        console.error('Error in getAirportsNearCity:', error);
        // res.status(500).json({ "error": error });
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }

};

export const getAirportsNearCity = async (req: Request, res: Response): Promise<void> => {
    const { city, country } = req.query;

    if (!city || !country) {
        // No input yet – render form only
        return res.render('form', { airports: null, error: null, city: '', country: '' });
    }

    try {
        const cityStr = (city as string).trim().toLowerCase();
        const countryStr = (country as string).trim().toLowerCase();

        const { latitude, longitude } = await getCoordinatesFromCity(cityStr, countryStr);

        const nearbyAirports = await Airport.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    distanceField: 'distanceInMeters',
                    spherical: true,
                    query: { country: countryStr },
                    maxDistance: 300000
                }
            },
            { $sort: { distanceInMeters: 1 } },
            { $limit: 5 }
        ]);

        res.render('form', {
            airports: nearbyAirports,
            error: null,
            city,
            country
        });

    } catch (err: any) {
        res.render('form', {
            airports: null,
            error: err.message || 'Something went wrong',
            city,
            country
        });
    }
};

export const countriesWithCities = async (req: Request, res: Response) => {
    try {
        const result = await Airport.aggregate([
            {
                $group: {
                    _id: "$country",
                    cities: { $addToSet: "$city" }
                }
            },
            {
                $project: {
                    _id: 0,
                    country: "$_id",
                    cities: 1
                }
            },
            {
                $sort: { country: 1 }
            }
        ]);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching countries with cities:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// get airports by country
export const getAirportsByCountry = async (req: Request, res: Response): Promise<void> => {
    try {
        const { country } = req.params;
        if (!country) {
            res.status(400).json({ message: 'Country is required.' });
            return
        }
        const airports = await Airport.find({
            country: new RegExp(`^${country}$`, 'i')
        });
        if (!airports.length) {
            res.status(404).json({ message: 'No airports found for the specified country.' });
            return
        }
        res.status(200).json({ msg: "data fetch successfully", data: airports });
        return
    } catch (error) {
        console.error('Error fetching airports by country:', error);
        res.status(500).json({ error: error });
        return
    }
};

// airport registration or addition
export const addSingleAirport = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name, iata, city, country, isInternational
        } = req.body;

        if (!name || !iata || !city || !country) {
            res.status(400).json({ message: 'Missing required fields.' });
            return
        }

        const existingAirport = await Airport.findOne({ iata: iata.toUpperCase().trim() });
        if (existingAirport) {
            res.status(409).json({ message: 'Airport with this IATA code already exists.' });
            return
        }
        const query = encodeURIComponent(`${city}, ${country}`);
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const geoResponse = await axios.get(nominatimUrl, {
            headers: {
                'User-Agent': 'himanshujatwal/1.0 (jatwalh@gmail.com)'
            }
        });

        if (!geoResponse.data.length) {
            res.status(404).json({ message: 'Location not found for the provided city and country.' });
            return
        }

        const { lat, lon } = geoResponse.data[0];

        const airport = new Airport({
            name,
            iata: iata.toUpperCase().trim(),
            city,
            country,
            latitude: parseFloat(lat),
            longitude: parseFloat(lon),
            isInternational: isInternational || false
        });
        await airport.save();
        console.log("airportle", airport)

        res.status(201).json({ message: 'Airport added successfully.', data: airport });
    } catch (error) {
        console.error('Error adding airport:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

// lsit of all airports world wide
export const getAllAirports = async (req: Request, res: Response): Promise<void> => {
    try {
        const airports = await Airport.find();
        res.status(200).json({ msg: "data fetch successfully", data: airports });
        return
    } catch (error) {
        console.error('Error fetching airports:', error);
        res.status(500).json({ message: 'Internal server error.' });
        return
    }
};

// bulk uploading of data by excel sheet ( rough fucntion )
export const addAirports = async (req: Request, res: Response): Promise<void> => {
    for (const entry of data) {
        const { name, iata, city, country, isInternational } = entry;

        // if (!name || !iata || !city || !country) {
        //     console.warn('Missing required fields:', entry);
        //     continue;
        // }

        const coords = await fetchCoordinates(city, country);
        if (!coords) {
            console.warn('Could not fetch location for:', city, country);
            continue;
        }

        try {
            const existing = await Airport.findOne({ iata: iata.toUpperCase().trim() });
            if (existing) {
                console.log(`Airport ${iata} already exists.`);
                continue;
            }

            const airport = new Airport({
                name,
                iata: iata.toUpperCase().trim(),
                city,
                country,
                latitude: coords.latitude,
                longitude: coords.longitude,
                isInternational: !!isInternational
            });

            await airport.save();
            console.log(`Saved airport: ${name}`);

        } catch (err) {
            console.error(`Error saving ${name}`, err);
        }
    }
}






export const getCitiesbyCountry = async (req: Request, res: Response): Promise<void> => {
    try {
        const country = req.query.country as string;
        if (!country) {
            res.status(400).json({ error: 'Country query parameter is required' });
            return
        }

        // Find distinct cities for the given country
        const cities = await Airport.distinct('city', { country: country });
        
        res.json(cities);
        return
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return
    }
}

