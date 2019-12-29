const prettier = require('prettier');
const minimist = require('minimist');
const { measureDuration } = require('./measure-duration');
const { writeDefinitionFile } = require('./write-definition-file');
const { readSwaggerConfig } = require('./read-swagger-config');
const { createTypesFromPathEntry } = require('./create-types-from-path-entry');
const {
  createTypesFromDefinitionEntry
} = require('./create-types-from-definition-entry');

const DEFAULT_OUTPUT_DIR = 'dist';
const DEFAULT_OUTPUT_FILENAME = 'swagger-to-typescript.d.ts';

async function main(options) {
  options.source = options.source || TEST_SWAGGER_UI_URL;
  options.dist = options.dist || DEFAULT_OUTPUT_DIR;
  options.filename = DEFAULT_OUTPUT_FILENAME;

  let swaggerConfig = await readSwaggerConfig(options.source);

  let typeDefinitionFileContent = '';

  for (let pathEntry of Object.entries(swaggerConfig.paths)) {
    let typeAlias = createTypesFromPathEntry(pathEntry);
    if (typeAlias === '') continue;
    typeDefinitionFileContent += typeAlias + '\n';
  }

  for (let definitionEntry of Object.entries(swaggerConfig.definitions)) {
    let typeAlias = createTypesFromDefinitionEntry(definitionEntry);
    if (typeAlias === '') continue;
    typeDefinitionFileContent += typeAlias + '\n';
  }

  let formattedTypeDefinitionFileContent = prettier.format(
    typeDefinitionFileContent,
    {
      parser: 'typescript'
    }
  );

  writeDefinitionFile(
    formattedTypeDefinitionFileContent,
    options.output,
    options.filename
  );
}

measureDuration(main.bind(null, minimist(process.argv.slice(2))));
