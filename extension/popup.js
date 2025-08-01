document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startScraping');
  const stopBtn = document.getElementById('stopScraping');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const listingCountInput = document.getElementById('listingCount');
  const delayInput = document.getElementById('delay');
  const saveLocationInput = document.getElementById('saveLocation');
  const chooseSaveLocationBtn = document.getElementById('chooseSaveLocation');
  
  let selectedSaveLocation = null;

  // Save location chooser
  chooseSaveLocationBtn.addEventListener('click', async function() {
    try {
      // For now, just show a message that custom location will be used
      // The actual file picker will be handled by Chrome's downloads API
      updateStatus('Custom save location will be prompted during download', 'active');
      selectedSaveLocation = 'custom';
      saveLocationInput.value = 'Custom location (will prompt)';
      
      setTimeout(() => {
        updateStatus('Ready', '');
      }, 2000);
    } catch (error) {
      console.error('Error setting save location:', error);
      updateStatus('Error setting save location', 'error');
    }
  });

  startBtn.addEventListener('click', async function() {
    const listingCount = parseInt(listingCountInput.value);
    const delay = parseInt(delayInput.value);
    
    // Immediate visual feedback
    updateStatus('Initializing...', 'active');
    startBtn.disabled = true;
    stopBtn.disabled = false;
    progress.textContent = 'Preparing to start scraping...';
    progressBar.style.display = 'flex';
    updateProgressBar(0, listingCount);
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab.url.includes('batdongsan.com.vn')) {
      updateStatus('Please navigate to batdongsan.com.vn first', 'error');
      resetUI();
      return;
    }

    updateStatus('Starting scraper...', 'active');
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'startScraping',
      listingCount: listingCount,
      delay: delay,
      saveLocation: selectedSaveLocation
    });
  });

  stopBtn.addEventListener('click', async function() {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(tab.id, {action: 'stopScraping'});
    
    updateStatus('Stopped', 'error');
    resetUI();
  });
  
  // Helper functions
  function updateStatus(message, type = '') {
    status.textContent = message;
    status.className = 'status-box';
    if (type) {
      status.classList.add(type);
    }
  }
  
  function updateProgressBar(current, total) {
    const percentage = total > 0 ? Math.round((current / total) * 100) : 0;
    progressFill.style.width = percentage + '%';
    progressText.textContent = percentage + '%';
  }
  
  function resetUI() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    progressBar.style.display = 'none';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
  }

  // Listen for updates from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'updateStatus') {
      updateStatus(request.status, 'active');
    }
    if (request.action === 'updateProgress') {
      progress.textContent = `Scraped: ${request.current}/${request.total}`;
      updateProgressBar(request.current, request.total);
    }
    if (request.action === 'scrapingComplete') {
      updateStatus('Scraping completed!', 'success');
      progress.textContent = `Downloaded ${request.count} listings`;
      updateProgressBar(request.count, request.count);
      setTimeout(() => {
        resetUI();
        updateStatus('Ready', '');
      }, 3000);
    }
    if (request.action === 'scrapingError') {
      updateStatus('Error: ' + request.error, 'error');
      progress.textContent = '';
      setTimeout(() => {
        resetUI();
        updateStatus('Ready', '');
      }, 5000);
    }
  });
});