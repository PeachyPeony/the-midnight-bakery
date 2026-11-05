import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Pastry from './models/pastry.js';

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

console.log('Connected to MongoDB with Mongoose!');

function isValidId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to The Midnight Bakery! ✨');
});

app.get('/pastries', async (req, res) => {
    const pastries = await Pastry.find();
    res.json(pastries);
});

app.get('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const pastry = await Pastry.findById(req.params.id);

    if (!pastry) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json(pastry);
});

app.put('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const updatedPastry = await Pastry.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    if (!updatedPastry) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json(updatedPastry);
});

app.post('/pastries', async (req, res) => {
    const newPastry = new Pastry(req.body);
    await newPastry.save();
    res.status(201).json(newPastry);
});

app.delete('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const deletedPastry = await Pastry.findByIdAndDelete(req.params.id);

    if (!deletedPastry) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json({ message: 'Pastry deleted successfully' });
});

app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});