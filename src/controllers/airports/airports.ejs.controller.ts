import { Request, Response } from 'express';
import { Airport } from "../../models/airports/airports.model";
import { getCoordinatesFromCity } from "../../Utils/utils"

export const getAirportsNearCityRender = async (req: Request, res: Response): Promise<void> => {
    const { city, country } = req.query;

    // Get country + city mapping
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


// get airports by country
export const getAirportsByCountryRender = async (req: Request, res: Response): Promise<void> => {
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

export const getAllAirportsRender = async (req: Request, res: Response): Promise<void> => {
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
