# Västsverige Restaurant Scraper

A tool to scrape restaurant data from the [Västsverige (West Sweden) website](https://www.vastsverige.com/en/eat-and-drink/restaurants/).

## Purpose

This scraper extracts information about restaurants listed on the Västsverige website, including:
- Restaurant names
- "Read more" URLs for each restaurant
- Automatically handles pagination by clicking the "Load more" button

## Installation

1. Clone this repository:
```
git clone https://github.com/Esm3277/vastsverigescraper.git
cd vastsverigescraper
```

2. Install dependencies:
```
npm install
```

## Usage

Run the scraper:
```
npm start
```

This will:
1. Launch a headless browser
2. Navigate to the Västsverige restaurants page
3. Extract all restaurant data
4. Output the results to the console

The scraper automatically clicks the "Load more" button to get all restaurants from all pages.

## Output Format

The script outputs a JSON array with objects for each restaurant:
```json
[
  {
    "title": "Restaurant Name",
    "url": "https://www.vastsverige.com/en/eat-and-drink/restaurants/restaurant-page/"
  },
  ...
]
```

## Requirements

- Node.js (v16 or higher recommended)
- NPM (v8 or higher recommended)

## Customization

You can modify the `scraper.js` file to extract additional data fields or change the output format as needed.

## License

MIT

