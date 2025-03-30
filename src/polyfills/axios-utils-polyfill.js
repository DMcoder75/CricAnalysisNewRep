/**
 * Custom polyfill for Axios utils.js to avoid process/browser dependency
 * This file replaces problematic parts of the Axios library that depend on Node.js modules
 */

// Import original utils except for the problematic parts
import * as utils from 'axios/lib/utils';

// Define a browser-compatible process object
const process = {
  env: {
    NODE_ENV: 'production'
  },
  browser: true
};

// Make process available globally
if (typeof window !== 'undefined') {
  window.process = process;
}

// Override the problematic functions
utils.isStandardBrowserEnv = function() {
  return true;
};

utils.isFormData = function(val) {
  return typeof FormData !== 'undefined' && val instanceof FormData;
};

utils.isArrayBufferView = function(val) {
  let result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
};

// Additional polyfills for browser environment
utils.getProtocol = function() {
  return window.location.protocol;
};

utils.isSpecCompliantForm = function() {
  return true;
};

// Export all utils
export default utils;
