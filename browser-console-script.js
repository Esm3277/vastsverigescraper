/**
 * Västsverige Restaurant Data Extractor - Browser Console Script
 * 
 * Instructions:
 * 1. Go to https://www.vastsverige.com/en/eat-and-drink/restaurants/
 * 2. Open your browser's developer tools (F12 or right-click > Inspect)
 * 3. Go to the Console tab
 * 4. Wait for the page to fully load
 * 5. Paste this entire script and press Enter
 * 6. The script will automatically click "Load more" until all restaurants are loaded
 * 7. It will then extract all restaurant data and display it in the console
 * 8. You can copy the final JSON output for your use
 */

// Function to extract restaurant data from current page
function extractCurrentRestaurants() {
  const restaurantElements = document.querySelectorAll('.filterapp__results > div > a');
  
  return Array.from(restaurantElements).map(item => {
    const titleElement = item.querySelector('article > div.filterappitem__body.article > div.filterappitem__header > div:nth-child(1) > h3');
    const title = titleElement ? titleElement.textContent.trim() : 'No title found';
    const url = item.href || null;
    
    return {
      title,
      url
    };
  });
}

// Function to check if "Load more" button exists and is not disabled
function hasMorePages() {
  const loadMoreButton = document.querySelector('.paging-module > div > button');
  return loadMoreButton && !loadMoreButton.disabled;
}

// Function to click "Load more" button and wait for new content
async function loadMoreContent(previousCount) {
  return new Promise((resolve, reject) => {
    try {
      // Click the load more button
      document.querySelector('.paging-module > div > button').click();
      
      // Set up an interval to check when new content is loaded
      const checkInterval = setInterval(() => {
        const currentCount = document.querySelectorAll('.filterapp__results > div > a').length;
        
        if (currentCount > previousCount) {
          clearInterval(checkInterval);
          // Add a small delay to ensure all DOM updates are complete
          setTimeout(() => resolve(currentCount), 1000);
        }
      }, 500);
      
      // Set a timeout to prevent infinite waiting
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Timeout waiting for new content to load'));
      }, 10000);
    } catch (error) {
      reject(error);
    }
  });
}

// Main function to run the scraper
async function scrapeAllRestaurants() {
  console.log('🍽️ Västsverige Restaurant Scraper - Starting...');
  
  let allRestaurants = [];
  let pageNum = 1;
  let moreAvailable = true;
  
  try {
    // Extract initial restaurants
    const initialRestaurants = extractCurrentRestaurants();
    console.log(`📋 Page ${pageNum}: Found ${initialRestaurants.length} restaurants`);
    allRestaurants = allRestaurants.concat(initialRestaurants);
    
    // Continue loading more pages while available
    while (moreAvailable && hasMorePages()) {
      console.log(`🔄 Clicking "Load more" button for page ${pageNum + 1}...`);
      const prevCount = allRestaurants.length;
      
      try {
        await loadMoreContent(prevCount);
        pageNum++;
        
        // Extract the new restaurants
        const currentRestaurants = extractCurrentRestaurants();
        const newRestaurants = currentRestaurants.slice(prevCount);
        
        console.log(`📋 Page ${pageNum}: Found ${newRestaurants.length} new restaurants`);
        allRestaurants = currentRestaurants; // Get full updated list
      } catch (error) {
        console.error('❌ Error loading more content:', error);
        moreAvailable = false;
      }
    }
    
    if (!hasMorePages()) {
      console.log('✅ All pages loaded. No more restaurants available.');
    }
    
    // Output final results
    console.log(`\n🎉 Scraping complete! Found ${allRestaurants.length} total restaurants.`);
    console.log('\n📊 Restaurant Data (JSON format):');
    console.log(JSON.stringify(allRestaurants, null, 2));
    
    return allRestaurants;
  } catch (error) {
    console.error('❌ Error during scraping:', error);
    return allRestaurants;
  }
}

// Run the scraper
scrapeAllRestaurants();
