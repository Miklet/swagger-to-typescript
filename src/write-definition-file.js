const fs = require('fs');
const path = require('path');

function writeDefinitionFile(fileContent, outputDir, outputFilename) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  let outputPath = path.resolve(outputDir, outputFilename);

  fs.writeFileSync(outputPath, fileContent, {
    encoding: 'utf-8'
  });
}

module.exports = {
  writeDefinitionFile
};
