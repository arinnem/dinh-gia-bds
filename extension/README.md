# Batdongsan.com.vn Chrome Extension Scraper

A Chrome extension that automatically scrapes real estate listings from batdongsan.com.vn with the ability to follow pagination links and export data to JSON.

## Features

- 🔍 **Automatic Scraping**: Scrapes listings from batdongsan.com.vn search results
- 📄 **Pagination Support**: Automatically follows "Next" page links
- 📊 **Data Extraction**: Extracts comprehensive listing information including:
  - Property name/title
  - Price
  - Full address (street, ward, district, province)
  - Legal status
  - Area/size
  - Number of bedrooms and bathrooms
  - Property description
  - Contact information
  - Property URL
- 📁 **JSON Export**: Automatically downloads scraped data as JSON file
- ⚙️ **Configurable**: Set number of listings to scrape and delay between pages
- 🛑 **Stop Control**: Ability to stop scraping at any time

## Installation

### Method 1: Load Unpacked Extension (Development)

1. **Open Chrome Extensions Page**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right corner)

2. **Load the Extension**:
   - Click "Load unpacked" button
   - Select the `extension` folder from this project
   - The extension should appear in your extensions list

3. **Pin the Extension**:
   - Click the puzzle piece icon (🧩) in Chrome toolbar
   - Find "Batdongsan.com.vn Scraper" and click the pin icon

## Usage

### Step-by-Step Guide

1. **Navigate to Batdongsan.com.vn**:
   - Go to [batdongsan.com.vn](https://batdongsan.com.vn)
   - Perform a search or navigate to any listing page

2. **Open the Extension**:
   - Click the extension icon in your Chrome toolbar
   - The popup interface will appear

3. **Configure Settings**:
   - **Number of listings**: Set how many listings you want to scrape (1-100)
   - **Delay between pages**: Set delay in milliseconds (minimum 1000ms recommended)

4. **Start Scraping**:
   - Click "Start Scraping" button
   - Monitor progress in the status and progress indicators
   - The extension will automatically navigate through pages

5. **Download Results**:
   - When complete, a JSON file will automatically download
   - File name format: `batdongsan_listings_YYYY-MM-DD_timestamp.json`

### Tips for Best Results

- **Use appropriate delays**: Set delay to 2000ms or higher to avoid being blocked
- **Start with small numbers**: Test with 5-10 listings first
- **Check network**: Ensure stable internet connection
- **Monitor progress**: Watch the status updates to ensure scraping is working

## Data Structure

The exported JSON file contains an array of listing objects with the following structure:

```json
[
  {
    "name": "Property title",
    "price": "Price information",
    "address": {
      "full": "Complete address",
      "street": "Street name",
      "ward": "Ward name",
      "district": "District name",
      "province": "Province name"
    },
    "legalStatus": "Legal documentation status",
    "area": "Property area/size",
    "bedrooms": "Number of bedrooms",
    "bathrooms": "Number of bathrooms",
    "url": "Direct link to property",
    "description": "Property description",
    "contactInfo": "Contact information",
    "scrapedAt": "2024-01-01T12:00:00.000Z"
  }
]
```

## Troubleshooting

### Common Issues

1. **"Please navigate to batdongsan.com.vn first"**:
   - Make sure you're on a batdongsan.com.vn page before starting

2. **No data extracted**:
   - The website structure may have changed
   - Try refreshing the page and starting again
   - Check browser console for errors (F12 → Console)

3. **Scraping stops unexpectedly**:
   - Increase the delay between pages
   - Check internet connection
   - The website may have rate limiting

4. **Extension not working**:
   - Reload the extension in `chrome://extensions/`
   - Check that all files are present in the extension folder
   - Ensure Developer mode is enabled

### Debug Mode

1. Open Chrome DevTools (F12)
2. Go to Console tab
3. Look for error messages or logs from the extension
4. Check Network tab for failed requests

## Technical Details

### Files Structure

- `manifest.json`: Extension configuration and permissions
- `popup.html`: User interface HTML
- `popup.js`: UI logic and user interactions
- `content.js`: Main scraping logic that runs on batdongsan.com.vn
- `background.js`: Background service worker for message handling
- `styles.css`: Styling for the popup interface

### Permissions Used

- `activeTab`: Access to current tab
- `storage`: Store extension settings
- `downloads`: Download JSON files
- `scripting`: Inject content scripts
- `host_permissions`: Access to batdongsan.com.vn

## Legal and Ethical Considerations

- **Respect robots.txt**: Check the website's robots.txt file
- **Rate limiting**: Use appropriate delays to avoid overloading servers
- **Terms of service**: Ensure compliance with batdongsan.com.vn's terms
- **Personal use**: This tool is intended for personal research purposes
- **Data privacy**: Handle scraped data responsibly

## Contributing

To modify or improve the extension:

1. Edit the relevant files in the `extension` folder
2. Reload the extension in `chrome://extensions/`
3. Test changes on batdongsan.com.vn
4. Update selectors in `content.js` if website structure changes

## Version History

- **v1.0**: Initial release with basic scraping functionality

---

**Note**: This extension is for educational and personal use only. Always respect website terms of service and use responsibly.