import axios from 'axios';

export const getCoordinatesFromCity = async (city: string, country: string): Promise<{ latitude: number; longitude: number }> => {
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

export async function fetchCoordinates(city: string, country: string) {
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
