let isScrapingActive = false;
let scrapedListings = [];
let scrapingState = {
  currentStep: 'idle', // 'idle', 'listing_page', 'detail_page', 'returning'
  listingUrls: [],
  currentListingIndex: 0,
  targetCount: 0,
  delay: 2000,
  returnUrl: '',
  tempListingData: null
};
let saveLocation = null;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === 'startScraping') {
    saveLocation = request.saveLocation;
    startScraping(request.listingCount, request.delay);
  } else if (request.action === 'stopScraping') {
    isScrapingActive = false;
    scrapingState.currentStep = 'idle';
  } else if (request.action === 'setSaveLocation') {
    saveLocation = request.location;
  }
});

async function startScraping(targetCount, delay) {
  isScrapingActive = true;
  scrapedListings = [];
  scrapingState = {
    currentStep: 'listing_page',
    listingUrls: [],
    currentListingIndex: 0,
    targetCount: targetCount,
    delay: delay,
    returnUrl: '',
    tempListingData: null
  };
  
  chrome.runtime.sendMessage({
    action: 'updateStatus',
    status: 'Initializing scraper...'
  });

  try {
    // Check if we're on a detail page and need to return to listing page
    if (isDetailPage()) {
      chrome.runtime.sendMessage({
        action: 'updateStatus',
        status: 'Returning to listing page...'
      });
      history.back();
      await waitForPageLoad();
    }
    
    await scrapeListingsWithDetailExtraction(targetCount, delay);
  } catch (error) {
    console.error('Scraping error:', error);
    chrome.runtime.sendMessage({
      action: 'scrapingError',
      error: error.message
    });
  }
}

async function scrapeListingsWithDetailExtraction(targetCount, delay) {
  let currentPage = 1;
  
  // Step 1: Collect listing URLs from search pages
  while (isScrapingActive && scrapingState.listingUrls.length < targetCount) {
    chrome.runtime.sendMessage({
      action: 'updateStatus',
      status: `Collecting listings from page ${currentPage}...`
    });

    // Extract listing URLs from current page
    const pageListingUrls = extractListingUrlsFromPage();
    scrapingState.listingUrls.push(...pageListingUrls);
    
    chrome.runtime.sendMessage({
      action: 'updateProgress',
      current: scrapingState.listingUrls.length,
      total: targetCount
    });

    // Check if we need to go to next page
    if (scrapingState.listingUrls.length < targetCount && isScrapingActive) {
      const nextPageLink = findNextPageLink();
      if (nextPageLink) {
        chrome.runtime.sendMessage({
          action: 'updateStatus',
          status: `Moving to page ${currentPage + 1}...`
        });
        
        await new Promise(resolve => setTimeout(resolve, delay));
        scrapingState.returnUrl = window.location.href;
        window.location.href = nextPageLink;
        await waitForPageLoad();
        currentPage++;
      } else {
        break; // No more pages
      }
    }
  }

  // Step 2: Visit each listing detail page
  scrapingState.currentStep = 'detail_page';
  const urlsToProcess = scrapingState.listingUrls.slice(0, targetCount);
  
  for (let i = 0; i < urlsToProcess.length && isScrapingActive; i++) {
    scrapingState.currentListingIndex = i;
    const listingUrl = urlsToProcess[i];
    
    chrome.runtime.sendMessage({
      action: 'updateStatus',
      status: `Extracting details from listing ${i + 1}/${urlsToProcess.length}...`
    });
    
    // Navigate to detail page
    window.location.href = listingUrl;
    await waitForPageLoad();
    
    // Extract detailed information
    const detailedListing = extractDetailedListingInfo();
    if (detailedListing) {
      scrapedListings.push(detailedListing);
      
      chrome.runtime.sendMessage({
        action: 'updateProgress',
        current: scrapedListings.length,
        total: targetCount
      });
    }
    
    // Wait before next request
    if (i < urlsToProcess.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
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

function extractListingUrlsFromPage() {
  const urls = [];
  
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
      const url = extractUrl(element);
      if (url && !urls.includes(url)) {
        urls.push(url);
      }
    } catch (error) {
      console.error('Error extracting listing URL:', error);
    }
  });
  
  return urls;
}

function extractDetailedListingInfo() {
  try {
    const listing = {
      // Basic information
      name: extractDetailText('.re__pr-title, .product-title, h1, .listing-title, .pr-title'),
      price: extractPropertyDetail('Mức giá') || extractDetailText('.re__pr-config-price, .price-value, .product-price, .listing-price, .re__pr-short-info-item:contains("tỷ"), .re__pr-short-info-item:contains("triệu")'),
      
      // Detailed address information
      address: extractDetailedAddress(),
      
      // Property specifications from detail page
      area: extractPropertyDetail('Diện tích') || extractDetailText('.re__pr-config-area, .area-value, .product-area'),
      landDirection: extractPropertyDetail('Hướng nhà') || extractDetailText('.re__pr-config-direction, .direction-value, .huong-nha'),
      balconyDirection: extractPropertyDetail('Hướng ban công') || extractDetailText('.re__pr-config-balcony-direction, .balcony-direction-value, .huong-ban-cong'),
      landWidth: extractPropertyDetail('Mặt tiền') || extractDetailText('.re__pr-config-width, .width-value, .mat-tien'),
      legalStatus: extractPropertyDetail('Pháp lý') || extractDetailText('.re__pr-config-legal, .legal-value, .phap-ly'),
      furniture: extractPropertyDetail('Nội thất') || extractDetailText('.re__pr-config-furniture, .furniture-value, .noi-that'),
      
      // Additional details
      bedrooms: extractDetailText('.re__pr-config-bedroom, .bedroom-value, .phong-ngu'),
      bathrooms: extractDetailText('.re__pr-config-bathroom, .bathroom-value, .phong-tam'),
      floors: extractDetailText('.re__pr-config-floor, .floor-value, .so-tang'),
      
      // Description and contact
      description: extractDetailText('.re__section-body, .product-description, .listing-description'),
      contactInfo: extractContactInfo(),
      
      // Metadata
      url: window.location.href,
      scrapedAt: new Date().toISOString(),
      detailPageExtracted: true
    };
    
    return listing;
  } catch (error) {
    console.error('Error extracting detailed listing info:', error);
    return null;
  }
}

function extractDetailedAddress() {
  // Try to extract structured address from detail page
  const addressSelectors = [
    '.re__pr-short-description',
    '.product-address',
    '.listing-address',
    '.address-detail'
  ];
  
  let fullAddress = '';
  for (const selector of addressSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      fullAddress = element.textContent.trim();
      break;
    }
  }
  
  // Parse Vietnamese address format
  const addressParts = fullAddress.split(',').map(part => part.trim());
  
  // Try to identify components based on Vietnamese address patterns
  let street = '', ward = '', district = '', province = '';
  
  for (const part of addressParts) {
    if (part.includes('Đường') || part.includes('Phố') || part.includes('Ngõ')) {
      street = part;
    } else if (part.includes('Phường') || part.includes('Xã')) {
      ward = part;
    } else if (part.includes('Quận') || part.includes('Huyện') || part.includes('Thành phố')) {
      district = part;
    } else if (part.includes('Hồ Chí Minh') || part.includes('Hà Nội') || part.includes('Đà Nẵng') || addressParts.indexOf(part) === addressParts.length - 1) {
      province = part;
    }
  }
  
  return {
    full: fullAddress,
    street: street,
    ward: ward,
    district: district,
    province: province
  };
}

function extractDetailText(selectors) {
  const selectorArray = selectors.split(', ');
  for (const selector of selectorArray) {
    const element = document.querySelector(selector);
    if (element) {
      return element.textContent.trim();
    }
  }
  return '';
}

function extractContactInfo() {
  const contactSelectors = [
    '.re__contact-name',
    '.contact-info',
    '.seller-info',
    '.agent-info'
  ];
  
  let contactInfo = {};
  
  for (const selector of contactSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      contactInfo.name = element.textContent.trim();
      break;
    }
  }
  
  const phoneElement = document.querySelector('.re__contact-phone, .contact-phone, .phone-number');
  if (phoneElement) {
    contactInfo.phone = phoneElement.textContent.trim();
  }
  
  return contactInfo;
}

function isDetailPage() {
  // Check if current page is a property detail page
  return window.location.href.includes('/ban-') || 
         window.location.href.includes('/cho-thue-') ||
         document.querySelector('.re__pr-title, .product-detail, .listing-detail') !== null;
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