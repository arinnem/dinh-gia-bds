document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('startScraping');
  const stopBtn = document.getElementById('stopScraping');
  const browseBtn = document.getElementById('browseSaveLocation');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const listingCountInput = document.getElementById('listingCount');
  const delayInput = document.getElementById('delay');
  const saveLocationDisplay = document.getElementById('saveLocationDisplay');
  const progressBarContainer = document.querySelector('.progress-bar-container');
  
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

  // Browse save location button
  if (browseBtn) {
    browseBtn.addEventListener('click', async function() {
      try {
        if (window.showDirectoryPicker) {
          const dirHandle = await window.showDirectoryPicker();
          selectedSaveLocation = dirHandle;
          saveLocationDisplay.textContent = `Selected: ${dirHandle.name}`;
        } else {
          // Fallback for browsers that don't support File System Access API
          alert('Directory picker not supported. Files will be saved to default Downloads folder.');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error selecting directory:', error);
          alert('Error selecting directory. Files will be saved to default Downloads folder.');
        }
      }
    });
  }

  startBtn.addEventListener('click', async function() {
    const listingCount = parseInt(listingCountInput.value);
    const delay = parseInt(delayInput.value);
    
    // Get current active tab
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    
    if (!tab.url.includes('batdongsan.com.vn')) {
      status.textContent = 'Please navigate to batdongsan.com.vn first';
      status.className = 'status error';
      return;
    }

    // Immediate visual feedback
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = 'Initializing enhanced scraper...';
    status.className = 'status active';
    progress.textContent = 'Preparing to extract detailed property information...';
    
    if (progressBarContainer) {
      progressBarContainer.style.display = 'block';
    }
    
    if (progressBar) {
      progressBar.style.width = '0%';
    }
    
    // Send save location to content script
    if (selectedSaveLocation) {
      chrome.tabs.sendMessage(tab.id, {
        action: 'setSaveLocation',
        location: selectedSaveLocation
      });
    }
    
    // Send message to content script
    chrome.tabs.sendMessage(tab.id, {
      action: 'startScraping',
      listingCount: listingCount,
      delay: delay
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
      status.textContent = request.status;
      status.className = 'status active';
    }
    if (request.action === 'updateProgress') {
      progress.textContent = `Extracted: ${request.current}/${request.total} detailed listings`;
      
      // Update progress bar
      if (progressBar && request.total > 0) {
        const percentage = (request.current / request.total) * 100;
        progressBar.style.width = percentage + '%';
      }
    }
    if (request.action === 'scrapingComplete') {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      status.textContent = 'Enhanced scraping completed!';
      status.className = 'status success';
      progress.textContent = `Successfully extracted ${request.count} detailed property listings`;
      
      if (progressBar) {
        progressBar.style.width = '100%';
      }
      
      // Reset UI after delay
      setTimeout(() => {
        resetUI();
      }, 5000);
    }
    if (request.action === 'scrapingError') {
      startBtn.disabled = false;
      stopBtn.disabled = true;
      status.textContent = 'Error: ' + request.error;
      status.className = 'status error';
      
      // Reset UI after delay
      setTimeout(() => {
        resetUI();
      }, 3000);
    }
  });
  
  function resetUI() {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = 'Ready';
    status.className = 'status';
    progress.textContent = '';
    
    if (progressBarContainer) {
       progressBarContainer.style.display = 'none';
     }
     
     if (progressBar) {
       progressBar.style.width = '0%';
     }
  }
});