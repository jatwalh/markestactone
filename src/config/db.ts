
import mongoose from 'mongoose';

// Move sensitive credentials to a .env file in production
const dbURL: string = "mongodb+srv://jatwalh:U1GG69XbLdQVSYFO@cluster0.pcktxrd.mongodb.net/test"

mongoose.connect(dbURL)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ Connection to DB failed:', err);
  });

export default dbURL;
