import { Request, Response } from 'express';
import { Airport } from "../../models/airports/airports.model";
import axios from 'axios';
import * as XLSX from 'xlsx';

const workbook = XLSX.readFile('./bOne.xlsx');
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json<AirportRow>(sheet);
interface AirportRow {
    name: string;
    iata: string;
    city: string;
    country: string;
    isInternational?: boolean;
}

export const getCoordinatesFromCity = async (
    city: string,
    country: string
): Promise<{ latitude: number; longitude: number }> => {
    const query = `${city}, ${country}`;
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'airport-locator-app'
            }
        });

        const data = response.data;

        if (!data || data.length === 0) {
            throw new Error('Location not found');
        }

        return {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon)
        };
    } catch (error) {
        console.error('Error fetching coordinates:', error);
        throw new Error('Failed to fetch coordinates');
    }
};


export const getAirportsNearCity = async (req: Request, res: Response): Promise<void> => {
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
                    maxDistance: 100000 // 100 km
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
    } catch (error) {
        console.error('Error in getAirportsNearCity:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


// export const getAirportsNearCity = async (req: Request, res: Response): Promise<void> => {
//     try {
//         let { city, country } = req.query;

//         if (!city || !country) {
//             res.status(400).json({ message: 'City and country are required.' });
//             return;
//         }

//         // Normalize for matching DB values
//         city = (city as string).trim().toLowerCase();
//         country = (country as string).trim().toLowerCase();

//         // Step 1: Get coordinates of city
//         const { latitude, longitude } = await getCoordinatesFromCity(city, country);

//         // Step 2: Geospatial query to find nearest airports
//         const airports = await Airport.find({
//             country: country,
//             location: {
//                 $near: {
//                     $geometry: {
//                         type: 'Point',
//                         coordinates: [longitude, latitude]
//                     },
//                     $maxDistance: 100000 // 100 km, adjust as needed
//                 }
//             }
//         });

//         if (!airports.length) {
//             res.status(404).json({ message: 'No nearby airports found.' });
//             return;
//         }

//         res.status(200).json({ data: airports });
//     } catch (error) {
//         console.error('Error in getAirportsNearCity:', error);
//         res.status(500).json({ message: 'Internal server error.' });
//     }
// };

 

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
        res.status(500).json({ message: 'Internal server error.' });
        return
    }
};

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

        console.log("le", lat, lon)

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





async function fetchCoordinates(city: string, country: string) {
    try {
        const query = encodeURIComponent(`${city}, ${country}`);
        const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

        const response = await axios.get(url, {
            headers: { 'User-Agent': 'himanshujatwal/1.0 (jatwalh@gmail.com)' }
        });

        if (response.data.length === 0) return null;

        const { lat, lon } = response.data[0];
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    } catch (err) {
        console.error(`Failed to fetch coordinates for ${city}, ${country}`, err);
        return null;
    }
}

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

