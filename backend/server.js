const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/images', express.static('public/images'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aytekin-auto', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Vehicle Schema (same as in scraper.js)
const vehicleSchema = new mongoose.Schema({
    id: Number,
    imageUrl: String,
    brand: String,
    model: String,
    year: String,
    km: String,
    color: String,
    price: String,
    link: { type: String, unique: true },
    localImagePath: String,
    details: {
        specs: mongoose.Schema.Types.Mixed,
        description: String,
        additionalImages: [String]
    },
    lastUpdated: { type: Date, default: Date.now }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// API Routes

// Get all vehicles with pagination
app.get('/api/vehicles', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const vehicles = await Vehicle.find()
            .skip(skip)
            .limit(limit)
            .sort({ lastUpdated: -1 });

        const total = await Vehicle.countDocuments();

        res.json({
            vehicles,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalVehicles: total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vehicle by ID
app.get('/api/vehicles/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findOne({ id: req.params.id });
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Search vehicles
app.get('/api/vehicles/search', async (req, res) => {
    try {
        const { brand, model, minPrice, maxPrice, minYear, maxYear } = req.query;
        const query = {};

        if (brand) query.brand = new RegExp(brand, 'i');
        if (model) query.model = new RegExp(model, 'i');
        
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = minPrice;
            if (maxPrice) query.price.$lte = maxPrice;
        }

        if (minYear || maxYear) {
            query.year = {};
            if (minYear) query.year.$gte = minYear;
            if (maxYear) query.year.$lte = maxYear;
        }

        const vehicles = await Vehicle.find(query).sort({ lastUpdated: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get vehicle statistics
app.get('/api/statistics', async (req, res) => {
    try {
        const stats = await Vehicle.aggregate([
            {
                $group: {
                    _id: null,
                    totalVehicles: { $sum: 1 },
                    averagePrice: { $avg: { $toDouble: { $replaceAll: { input: "$price", find: "TL", replacement: "" } } } },
                    brands: { $addToSet: "$brand" },
                    models: { $addToSet: "$model" }
                }
            }
        ]);

        res.json({
            totalVehicles: stats[0].totalVehicles,
            averagePrice: Math.round(stats[0].averagePrice),
            uniqueBrands: stats[0].brands.length,
            uniqueModels: stats[0].models.length
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
