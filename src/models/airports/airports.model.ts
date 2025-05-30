import { Schema, model, Document } from 'mongoose';

export interface IAirport extends Document {
    name: string;
    iata: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
    isInternational: boolean;
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
}

const AirportSchema = new Schema<IAirport>({
    name: {
        type: String,
        required: true
    },
    iata: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    isInternational: {
        type: Boolean,
        default: false
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});
AirportSchema.index({ location: '2dsphere' });

export const Airport = model<IAirport>('Airport', AirportSchema);
