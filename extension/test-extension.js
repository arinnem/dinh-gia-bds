// Test script for debugging the extension
// Run this in the browser console on batdongsan.com.vn

console.log('=== Extension Test Script ===');

// Test 1: Check if content script is loaded
if (window.testContentScript) {
  console.log('✅ Content script is loaded');
  console.log('Test result:', window.testContentScript());
} else {
  console.log('❌ Content script is NOT loaded');
}

// Test 2: Check if we can find listing elements
function testListingElements() {
  const selectors = [
    '.search-productItem',
    '.product-item',
    '[data-testid="product-item"]',
    '.re__card-full',
    '.js__product-link-for-product-id',
    '.product-item-content'
  ];
  
  let found = false;
  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      console.log(`✅ Found ${elements.length} elements with selector: ${selector}`);
      found = true;
      break;
    }
  }
  
  if (!found) {
    console.log('❌ No listing elements found with any selector');
  }
  
  return found;
}

// Test 3: Check page structure
function testPageStructure() {
  console.log('=== Page Structure Test ===');
  console.log('URL:', window.location.href);
  console.log('Title:', document.title);
  console.log('Body classes:', document.body.className);
  
  // Check for common batdongsan elements
  const commonElements = [
    'header',
    'nav',
    '.search-box',
    '.filter',
    '.pagination'
  ];
  
  commonElements.forEach(selector => {
    const element = document.querySelector(selector);
    if (element) {
      console.log(`✅ Found: ${selector}`);
    } else {
      console.log(`❌ Not found: ${selector}`);
    }
  });
}

// Run tests
console.log('Running tests...');
testListingElements();
testPageStructure();

console.log('=== Test Complete ===');
console.log('If you see errors above, the extension might not work properly on this page.'); 