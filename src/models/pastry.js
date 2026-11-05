import mongoose from 'mongoose';

const pastrySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Truly magical', 'Lightly enchanted']
    },
    description: {
        type: String,
        required: true
    },
    magicalDetail: {
        type: String,
        required: true
    },
    rarity: {
        type: String,
        required: true,
        enum: ['Common', 'Unusual', 'Rare']
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
});

const Pastry = mongoose.model('Pastry', pastrySchema);

export default Pastry;