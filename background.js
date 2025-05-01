// Listen for web requests to detect JSON content
chrome.scripting.registerContentScripts([{
  id: 'json-viewer',
  matches: ['<all_urls>'],
  js: ['content.js'],
  runAt: 'document_start'
}]).catch(console.error);

// Store user preferences
const defaultSettings = {
  theme: 'light',
  initialDepth: 2,
  showMinimap: true
};

// Initialize settings on installation
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ settings: defaultSettings });
  console.log('JSON Viewer extension installed');
});

// Listen for content script messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getExtensionUrl') {
    sendResponse({ url: chrome.runtime.getURL(request.path) });
  }
  return true;
}); 