const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

async function readSwaggerConfig(configPath) {
  let isConfigResource = configPath.startsWith('http');

  let config = isConfigResource
    ? await fetchSwaggerConfig(configPath)
    : readSwaggerConfigFile(configPath);

  return config;
}

async function fetchSwaggerConfig(configPath) {
  let res = await fetch(configPath);
  let config = await res.json();
  return config;
}

function readSwaggerConfigFile(configPath) {
  let absolutePathToConfig = path.resolve(configPath);

  let fileContent = fs.readFileSync(absolutePathToConfig, {
    encoding: 'utf-8'
  });

  let config = JSON.parse(fileContent);

  return config;
}

module.exports = {
  readSwaggerConfig
};
