// Background script for handling extension lifecycle
chrome.runtime.onInstalled.addListener(() => {
  console.log('Batdongsan scraper extension installed');
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle file download requests
  if (request.action === 'downloadFile') {
    chrome.downloads.download({
      url: request.url,
      filename: request.filename,
      saveAs: request.saveAs || false // Show save dialog if requested
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError);
      } else {
        console.log('Download started with ID:', downloadId);
      }
    });
    return;
  }
  
  // Forward messages between content script and popup
  if (request.action === 'updateStatus' || 
      request.action === 'updateProgress' || 
      request.action === 'scrapingComplete' ||
      request.action === 'scrapingError') {
    // Broadcast to all extension contexts
    chrome.runtime.sendMessage(request);
  }
});

// Handle tab updates to detect navigation
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && tab.url.includes('batdongsan.com.vn')) {
    // Inject content script if needed
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).catch(err => {
      // Content script might already be injected
      console.log('Content script injection skipped:', err.message);
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  if (tab.url && tab.url.includes('batdongsan.com.vn')) {
    // Open popup (this is handled automatically by manifest)
  } else {
    // Show notification to navigate to batdongsan.com.vn
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Batdongsan Scraper',
      message: 'Please navigate to batdongsan.com.vn to use this extension.'
    });
  }
});