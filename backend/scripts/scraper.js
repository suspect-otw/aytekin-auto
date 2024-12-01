const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

dotenv.config();

// Constants
const UPDATE_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aytekin-auto', {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Vehicle Schema
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

// Create images directory if it doesn't exist
const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode === 200) {
                const filePath = path.join(imagesDir, filename);
                const writeStream = fs.createWriteStream(filePath);
                response.pipe(writeStream);
                writeStream.on('finish', () => {
                    writeStream.close();
                    resolve(filePath);
                });
            } else {
                reject(new Error(`Failed to download image: ${response.statusCode}`));
            }
        }).on('error', reject);
    });
}

async function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time);
    });
}

async function cleanOldImages() {
    try {
        const files = await fs.promises.readdir(imagesDir);
        for (const file of files) {
            await fs.promises.unlink(path.join(imagesDir, file));
        }
        console.log('Cleaned old images');
    } catch (error) {
        console.error('Error cleaning old images:', error);
    }
}

async function scrapeWebsite() {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-maximized']
    });

    try {
        // Clear existing vehicles
        await Vehicle.deleteMany({});
        console.log('Cleared existing vehicles from database');

        // Clean old images before new scrape
        await cleanOldImages();

        const page = await browser.newPage();
        console.log('Navigating to website...');
        
        await page.goto('https://aytekinauto.sahibinden.com/', {
            waitUntil: 'networkidle0',
            timeout: 60000
        });

        await page.waitForSelector('.classified-list', { timeout: 30000 });
        
        const updateTime = new Date();
        
        const vehicles = await page.evaluate(() => {
            const results = [];
            const items = document.querySelectorAll('.classified-list tr:not(.searchResultsPromoSuper)');
            
            items.forEach((item, index) => {
                if (!item.querySelector('td')) return;
                
                const imageElement = item.querySelector('.classified-image img');
                const titleElement = item.querySelector('td:nth-child(2)');
                const modelElement = item.querySelector('td:nth-child(3)');
                const yearElement = item.querySelector('td:nth-child(4)');
                const kmElement = item.querySelector('td:nth-child(5)');
                const colorElement = item.querySelector('td:nth-child(6)');
                const priceElement = item.querySelector('.price');
                const linkElement = item.querySelector('.classified-image');

                if (!imageElement || !titleElement) return;

                const vehicleData = {
                    id: index + 1,
                    imageUrl: imageElement.src,
                    brand: titleElement.textContent.trim(),
                    model: modelElement ? modelElement.textContent.trim() : '',
                    year: yearElement ? yearElement.textContent.trim() : '',
                    km: kmElement ? kmElement.textContent.trim() : '',
                    color: colorElement ? colorElement.textContent.trim() : '',
                    price: priceElement ? priceElement.textContent.trim() : '',
                    link: linkElement ? linkElement.href : ''
                };

                results.push(vehicleData);
            });

            return results;
        });

        console.log(`Found ${vehicles.length} vehicles`);

        for (let i = 0; i < vehicles.length; i++) {
            const vehicle = vehicles[i];
            try {
                vehicle.lastUpdated = updateTime;
                
                const imageExtension = path.extname(vehicle.imageUrl) || '.jpg';
                const imageName = `car_${vehicle.id}${imageExtension}`;
                await downloadImage(vehicle.imageUrl, imageName);
                vehicle.localImagePath = `/images/${imageName}`;
                
                await page.goto(vehicle.link, { waitUntil: 'networkidle0', timeout: 30000 });
                await delay(2000);

                const details = await page.evaluate(() => {
                    const specs = {};
                    document.querySelectorAll('.classifiedInfoList li').forEach(item => {
                        const label = item.querySelector('strong')?.textContent.trim();
                        const value = item.querySelector('span')?.textContent.trim();
                        if (label && value) {
                            specs[label] = value;
                        }
                    });

                    return {
                        specs,
                        description: document.querySelector('.classifiedDescription')?.textContent.trim() || '',
                        additionalImages: Array.from(document.querySelectorAll('.classifiedDetailPhotos img'))
                            .map(img => img.src)
                    };
                });

                vehicle.details = details;

                // Save to MongoDB
                const newVehicle = new Vehicle(vehicle);
                await newVehicle.save();

                console.log(`Processed vehicle ${i + 1}/${vehicles.length}`);
            } catch (error) {
                console.error(`Error processing vehicle ${i + 1}:`, error.message);
            }
        }

        console.log('Scraping completed successfully');
        console.log(`Total vehicles processed: ${vehicles.length}`);
        console.log(`Next update scheduled for: ${new Date(updateTime.getTime() + UPDATE_INTERVAL).toLocaleString()}`);

    } catch (error) {
        console.error('An error occurred during scraping:', error);
    } finally {
        await browser.close();
        await mongoose.connection.close();
    }
}

async function startScrapingSchedule() {
    while (true) {
        console.log('Starting scraping process...');
        await scrapeWebsite();
        console.log('Waiting 24 hours before next update...');
        await delay(UPDATE_INTERVAL);
    }
}

// Run the scraper with auto-update
console.log('Starting auto-updating scraper...');
startScrapingSchedule().catch(console.error);
