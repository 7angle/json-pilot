function isJSONContentType() {
  const contentType = document.contentType || '';
  return contentType.toLowerCase().includes('application/json');
}

function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function getExtensionURL(path) {
  return chrome.runtime.getURL(path);
}

async function injectViewer(jsonContent) {
  // Create iframe for the viewer
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; border: none; background: white; z-index: 2147483647;';
  iframe.src = getExtensionURL('index.html');
  
  // Add iframe to page
  document.documentElement.innerHTML = '';
  document.body.appendChild(iframe);

  // Wait for viewer to be ready
  window.addEventListener('message', function(event) {
    // Only accept messages from our viewer
    if (event.data === 'viewer-ready') {
      // Send JSON data to viewer
      iframe.contentWindow.postMessage({
        type: 'json-data',
        content: jsonContent
      }, '*');
    }
  });
}

function processJSON() {
  const bodyText = document.body.textContent;
  
  if (isValidJSON(bodyText)) {
    // If valid JSON is found, inject the viewer
    injectViewer(bodyText);
  }
}

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', processJSON);
} else {
  processJSON();
} 