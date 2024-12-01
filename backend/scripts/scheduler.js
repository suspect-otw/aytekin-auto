const cron = require('node-cron');
const { exec } = require('child_process');
const path = require('path');

// Schedule scraping to run every day at 3 AM
cron.schedule('0 3 * * *', () => {
  console.log('Starting scheduled scraping...');
  const scraperPath = path.join(__dirname, 'scraper.js');
  
  exec(`node ${scraperPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing scraper: ${error}`);
      return;
    }
    
    if (stderr) {
      console.error(`Scraper stderr: ${stderr}`);
    }
    
    console.log(`Scraper stdout: ${stdout}`);
  });
});
