let isScrapingActive = false;
let scrapedListings = [];
let saveLocation = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startScraping') {
    saveLocation = request.saveLocation;
    startScraping(request.listingCount, request.delay);
  } else if (request.action === 'stopScraping') {
    isScrapingActive = false;
  }
});

async function startScraping(targetCount, delay) {
  isScrapingActive = true;
  scrapedListings = [];
  
  chrome.runtime.sendMessage({
    action: 'updateStatus',
    status: 'Initializing scraper...'
  });

  try {
    await scrapeListings(targetCount, delay);
  } catch (error) {
    console.error('Scraping error:', error);
    chrome.runtime.sendMessage({
      action: 'scrapingError',
      error: error.message
    });
  }
}

async function scrapeListings(targetCount, delay) {
  let currentPage = 1;
  
  while (isScrapingActive && scrapedListings.length < targetCount) {
    chrome.runtime.sendMessage({
      action: 'updateStatus',
      status: `Scraping page ${currentPage}...`
    });

    // Extract listings from current page
    const pageListings = extractListingsFromPage();
    
    for (const listing of pageListings) {
      if (scrapedListings.length >= targetCount) break;
      scrapedListings.push(listing);
      
      chrome.runtime.sendMessage({
        action: 'updateProgress',
        current: scrapedListings.length,
        total: targetCount
      });
    }

    // Check if we need to go to next page
    if (scrapedListings.length < targetCount && isScrapingActive) {
      const nextPageLink = findNextPageLink();
      if (nextPageLink) {
        chrome.runtime.sendMessage({
          action: 'updateStatus',
          status: `Moving to page ${currentPage + 1}...`
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        window.location.href = nextPageLink;
        await waitForPageLoad();
        currentPage++;
      } else {
        break; // No more pages
      }
    }
  }

  if (isScrapingActive) {
    downloadJSON();
    chrome.runtime.sendMessage({
      action: 'scrapingComplete',
      count: scrapedListings.length
    });
  }
}

function extractListingsFromPage() {
  const listings = [];
  
  // Multiple selectors to handle different page layouts on batdongsan.com.vn
  const listingSelectors = [
    '.search-productItem',
    '.product-item',
    '[data-testid="product-item"]',
    '.re__card-full',
    '.js__product-link-for-product-id',
    '.product-item-content'
  ];
  
  let listingElements = [];
  for (const selector of listingSelectors) {
    listingElements = document.querySelectorAll(selector);
    if (listingElements.length > 0) break;
  }
  
  listingElements.forEach(element => {
    try {
      const listing = {
        name: extractText(element, '.product-title, .re__card-title, h3 a, .product-name, .pr-title a, .product-link'),
        price: extractText(element, '.product-price, .re__card-config-price, .price, .product-price-value, .pr-price'),
        address: extractAddress(element),
        legalStatus: extractText(element, '.legal-status, .product-legal, [data-legal], .re__card-config-legal'),
        area: extractText(element, '.product-area, .re__card-config-area, .area, .product-area-value, .pr-area'),
        bedrooms: extractText(element, '.bedroom, .bed-room, [data-bedrooms], .re__card-config-bedroom'),
        bathrooms: extractText(element, '.bathroom, .bath-room, [data-bathrooms], .re__card-config-bathroom'),
        url: extractUrl(element),
        description: extractText(element, '.product-description, .re__card-description, .description'),
        contactInfo: extractText(element, '.contact-info, .seller-info, .agent-info'),
        scrapedAt: new Date().toISOString()
      };
      
      // Only add if we have at least name and price
      if (listing.name && listing.price) {
        listings.push(listing);
      }
    } catch (error) {
      console.error('Error extracting listing:', error);
    }
  });
  
  return listings;
}

function extractText(element, selectors) {
  const selectorArray = selectors.split(', ');
  for (const selector of selectorArray) {
    const found = element.querySelector(selector);
    if (found) {
      return found.textContent.trim();
    }
  }
  return '';
}

function extractAddress(element) {
  // Try multiple possible address selectors
  const addressSelectors = [
    '.product-address',
    '.re__card-location',
    '.address',
    '.location',
    '[data-address]',
    '.pr-location',
    '.product-location'
  ];
  
  for (const selector of addressSelectors) {
    const addressElement = element.querySelector(selector);
    if (addressElement) {
      const fullAddress = addressElement.textContent.trim();
      
      // Try to parse address components
      const addressParts = fullAddress.split(',').map(part => part.trim());
      
      return {
        full: fullAddress,
        street: extractText(element, '.street, .product-street') || (addressParts[0] || ''),
        ward: extractText(element, '.ward, .product-ward') || (addressParts[1] || ''),
        district: extractText(element, '.district, .product-district') || (addressParts[2] || ''),
        province: extractText(element, '.province, .product-province') || (addressParts[3] || '')
      };
    }
  }
  
  return { full: '', street: '', ward: '', district: '', province: '' };
}

function extractUrl(element) {
  const linkSelectors = [
    'a[href]',
    '.product-link',
    '.re__card-title a',
    '.product-title a'
  ];
  
  for (const selector of linkSelectors) {
    const linkElement = element.querySelector(selector);
    if (linkElement) {
      const href = linkElement.getAttribute('href');
      if (href) {
        return href.startsWith('http') ? href : `https://batdongsan.com.vn${href}`;
      }
    }
  }
  
  return '';
}

function findNextPageLink() {
  // Look for next page button/link with multiple possible selectors
  const nextSelectors = [
    '.pagination .next:not(.disabled)',
    '.paging .next:not(.disabled)',
    'a[aria-label="Next"]',
    '.pagination li:last-child a:not(.disabled)',
    '[data-testid="pagination-next"]',
    '.re__pagination-next',
    '.pagination-next',
    'a[title="Next"]',
    '.next-page'
  ];
  
  for (const selector of nextSelectors) {
    const nextElement = document.querySelector(selector);
    if (nextElement && !nextElement.classList.contains('disabled') && nextElement.href) {
      return nextElement.href;
    }
  }
  
  // Alternative: look for page numbers and find the next one
  const currentPageNum = getCurrentPageNumber();
  if (currentPageNum) {
    const nextPageLink = document.querySelector(`a[href*="p${currentPageNum + 1}"]`);
    if (nextPageLink) {
      return nextPageLink.href;
    }
  }
  
  return null;
}

function getCurrentPageNumber() {
  // Try to extract current page number from URL or pagination
  const urlMatch = window.location.href.match(/[?&]p=(\d+)/);
  if (urlMatch) {
    return parseInt(urlMatch[1]);
  }
  
  const activePageElement = document.querySelector('.pagination .active, .pagination .current, .re__pagination-current');
  if (activePageElement) {
    const pageNum = parseInt(activePageElement.textContent);
    if (!isNaN(pageNum)) {
      return pageNum;
    }
  }
  
  return 1; // Default to page 1
}

function waitForPageLoad() {
  return new Promise(resolve => {
    if (document.readyState === 'complete') {
      // Wait a bit more for dynamic content
      setTimeout(resolve, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(resolve, 1000);
      });
    }
  });
}

async function downloadJSON() {
  const dataStr = JSON.stringify(scrapedListings, null, 2);
  const filename = `batdongsan_listings_${new Date().toISOString().split('T')[0]}_${Date.now()}.json`;
  
  try {
    if (saveLocation && window.showSaveFilePicker) {
      // Use File System Access API if available and save location is selected
      const fileHandle = await saveLocation.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(dataStr);
      await writable.close();
    } else {
      // Fallback to Chrome downloads API
      const dataBlob = new Blob([dataStr], {type: 'application/json'});
      const url = URL.createObjectURL(dataBlob);
      
      chrome.runtime.sendMessage({
         action: 'downloadFile',
         url: url,
         filename: filename,
         saveAs: saveLocation === 'custom' // Show save dialog if custom location selected
       });
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
    }
  } catch (error) {
    console.error('Error saving file:', error);
    // Fallback to traditional download
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => {
      URL.revokeObjectURL(link.href);
    }, 1000);
  }
}