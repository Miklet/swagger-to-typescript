const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const minimist = require('minimist');
const { measureDuration } = require('./measure-duration');
const { convertSchemaToType } = require('./convert-schema-to-type');
const { writeDefinitionFile } = require('./write-definition-file');
const { readSwaggerConfig } = require('./read-swagger-config');
const { createObjectProperty } = require('./create-object-property');
const { createTypesFromPathEntry } = require('./create-types-from-path-entry');

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

    // console.log(typeAlias);
  }

  for (let definitionEntry of Object.entries(swaggerConfig.definitions)) {
    let typeAlias = createTypeFromDefinition(definitionEntry);
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

function createTypeFromDefinition([definitionKey, definitionValue]) {
  let definitionEntries = Object.entries(definitionValue.properties);
  let requiredProperties = definitionValue.required || [];
  let typeDefinition = '';

  typeDefinition += `type ${definitionKey} = {\n`;

  definitionEntries.forEach(([propertyKey, propertyValue]) => {
    let tsType = convertSchemaToType(propertyValue);
    let isRequired = requiredProperties.includes(propertyKey);
    typeDefinition += createObjectProperty(propertyKey, tsType, isRequired);
  });

  typeDefinition += '}\n';

  return typeDefinition;
}

measureDuration(main.bind(null, minimist(process.argv.slice(2))));
