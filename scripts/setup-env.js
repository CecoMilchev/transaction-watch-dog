#!/usr/bin/env node

/**
 * Simple environment setup script
 * Copies .env.example files to .env files if they don't exist
 */

const fs = require('fs');
const path = require('path');

const services = [
    'src/configurations',
    'src/fetcher', 
    'src/transactions'
];

function copyEnvFile(servicePath) {
    const envExamplePath = path.join(servicePath, '.env.example');
    const envPath = path.join(servicePath, '.env');
    
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
        try {
            fs.copyFileSync(envExamplePath, envPath);
        } catch (error) {
        }
    }
}

services.forEach(copyEnvFile);

console.log('\n📝 Remember to add your INFURA_API_KEY to src/fetcher/.env');