// Västsverige Restaurant Scraper
// This script uses Puppeteer to scrape restaurant data from vastsverige.com

const puppeteer = require('puppeteer');

// Main scraping function
async function scrapeRestaurants() {
  console.log('Starting browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    console.log('Navigating to vastsverige.com...');
    await page.goto('https://www.vastsverige.com/en/eat-and-drink/restaurants/', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    
    console.log('Waiting for content to load...');
    // Wait for the restaurant results to load
    await page.waitForSelector('.filterapp__results');
    
    // Initialize an array to store restaurant data
    let restaurants = [];
    let hasMorePages = true;
    let pageNum = 1;
    
    while (hasMorePages) {
      console.log(`Processing page ${pageNum}...`);
      
      // Extract restaurant information
      const pageRestaurants = await page.evaluate(() => {
        const items = document.querySelectorAll('.filterapp__results > div > a');
        return Array.from(items).map(item => {
          const titleElement = item.querySelector('article > div.filterappitem__body.article > div.filterappitem__header > div:nth-child(1) > h3');
          const title = titleElement ? titleElement.textContent.trim() : 'No title';
          const url = item.href || null;
          
          return {
            title,
            url
          };
        });
      });
      
      console.log(`Found ${pageRestaurants.length} restaurants on page ${pageNum}`);
      restaurants = restaurants.concat(pageRestaurants);
      
      // Check if there's a "Load more" button and click it if available
      const loadMoreExists = await page.evaluate(() => {
        const loadMoreButton = document.querySelector('.paging-module > div > button');
        return loadMoreButton && !loadMoreButton.disabled;
      });
      
      if (loadMoreExists) {
        console.log('Clicking "Load more" button...');
        await page.click('.paging-module > div > button');
        
        // Wait for the new content to load
        await page.waitForFunction(
          (prevCount) => document.querySelectorAll('.filterapp__results > div > a').length > prevCount,
          { timeout: 30000 },
          pageRestaurants.length
        );
        
        // Wait a bit for animations to complete
        await page.waitForTimeout(2000);
        
        pageNum++;
      } else {
        hasMorePages = false;
        console.log('No more pages to load.');
      }
    }
    
    console.log(`Total restaurants found: ${restaurants.length}`);
    console.log('Restaurants data:');
    console.log(JSON.stringify(restaurants, null, 2));
    
    return restaurants;
  } catch (error) {
    console.error('Error occurred during scraping:', error);
    throw error;
  } finally {
    await browser.close();
    console.log('Browser closed.');
  }
}

// Run the scraper if this is the main module
if (require.main === module) {
  scrapeRestaurants()
    .then(data => {
      console.log('Scraping completed successfully!');
    })
    .catch(error => {
      console.error('Scraping failed:', error);
      process.exit(1);
    });
} else {
  module.exports = { scrapeRestaurants };
}
