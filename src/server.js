import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGODB_URI);

await client.connect();

console.log('Connected to MongoDB!');

const db = client.db('midnight-bakery');
const pastriesCollection = db.collection('pastries');

function isValidId(id) {
    return /^[0-9a-fA-F]{24}$/.test(id);
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to The Midnight Bakery! ✨');
});

app.get('/pastries', async (req, res) => {
    const pastries = await pastriesCollection.find().toArray();
    res.json(pastries);
});

app.get('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const pastry = await pastriesCollection.findOne({
        _id: new ObjectId(req.params.id)
    });

    if (!pastry) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json(pastry);
});

app.put('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const updatedPastry = req.body;

    const result = await pastriesCollection.replaceOne(
        { _id: new ObjectId(req.params.id) },
        updatedPastry
    );

    if (result.matchedCount === 0) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json(result);
});

app.post('/pastries', async (req, res) => {
    const newPastry = req.body;

    const result = await pastriesCollection.insertOne(newPastry);

    res.status(201).json(result);
});

app.delete('/pastries/:id', async (req, res) => {
    if (!isValidId(req.params.id)) {
        return res.status(400).json({ error: 'Invalid pastry ID' });
    }

    const result = await pastriesCollection.deleteOne({
        _id: new ObjectId(req.params.id)
    });

    if (result.deletedCount === 0) {
        return res.status(404).json({ error: 'Pastry not found' });
    }

    res.json({ message: 'Pastry deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});