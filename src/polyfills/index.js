// This file provides global polyfills for Node.js core modules
import process from 'process';
import { Buffer } from 'buffer';

// Make process and Buffer available globally
window.process = process;
window.Buffer = Buffer;
