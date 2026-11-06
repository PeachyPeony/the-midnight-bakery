import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Pastry from './models/pastry.js';
import pastries from './data/pastries.json' with { type: 'json'};

dotenv.config();

try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB with Mongoose!');

    const existingPastries = await Pastry.countDocuments();

    if (existingPastries === 0) {
        await Pastry.insertMany(pastries);
        console.log('Pastry seed data inserted successfully!');
    } else {
        console.log('Pastries already exist. Skipping seed data.');
    }
} catch (error) {
    console.error('Error seeding pastries:', error);
} finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
}