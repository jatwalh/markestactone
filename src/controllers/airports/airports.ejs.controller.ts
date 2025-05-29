import { Request, Response } from 'express';
import { Airport } from "../../models/airports/airports.model";
import { getCoordinatesFromCity } from "../../Utils/utils"

export const getAirportsNearCityRender = async (req: Request, res: Response): Promise<void> => {
    const { city, country } = req.query;

    const countriesWithCities = await Airport.aggregate([
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
        { $sort: { country: 1 } }
    ]);

    const selectedCities = countriesWithCities.find(
        entry => entry.country === country
    )?.cities || [];

    if (!city || !country) {
        return res.render('form', {
            airports: null,
            error: null,
            city: '',
            country: '',
            countriesWithCities: countriesWithCities || [],
            selectedCities
        });
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
            country,
            countriesWithCities,
            selectedCities
        });

    } catch (err: any) {
        res.render('form', {
            airports: null,
            error: err.message || 'Something went wrong',
            city,
            country,
            countriesWithCities,
            selectedCities
        });
    }
};

export const getAllAirportsRender = async (req: Request, res: Response): Promise<void> => {
    try {
        const airports = await Airport.find();
        res.render('search', { airports }); 
    } catch (error) {
        console.error('Error loading search page:', error);
        res.status(500).send('Internal server error');
    }
};
