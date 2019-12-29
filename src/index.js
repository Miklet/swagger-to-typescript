const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const minimist = require('minimist');
const { measureDuration } = require('./measure-duration');
const { convertSchemaToType } = require('./convert-schema-to-type');
const { writeDefinitionFile } = require('./write-definition-file');
const { readSwaggerConfig } = require('./read-swagger-config');

const DEFAULT_OUTPUT_DIR = 'dist';
const DEFAULT_OUTPUT_FILENAME = 'swagger-to-typescript.d.ts';

async function main(options) {
  options.source = options.source || TEST_SWAGGER_UI_URL;
  options.dist = options.dist || DEFAULT_OUTPUT_DIR;
  options.filename = DEFAULT_OUTPUT_FILENAME;

  let swaggerConfig = await readSwaggerConfig(options.source);

  let typeDefinitionFileContent = '';

  for (let pathEntry of Object.entries(swaggerConfig.paths)) {
    let typeAlias = createTypeFromPath(pathEntry);

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

function capitalizeFirstLetter(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function createTypeFromPath([pathKey, pathValue]) {
  let methodsEntries = Object.entries(pathValue);
  let pathTypes = '';

  for (let [methodKey, methodValue] of methodsEntries) {
    if (!methodValue.operationId) {
      console.warn(
        `Skipping generating type for path ${pathKey} and method ${methodKey}. Property 'operationId' is required to generate proper type name.`
      );
    }
    let methodTypeName = capitalizeFirstLetter(methodValue.operationId);

    // if (methodValue.parameters.length > 0) {
    //   pathTypes += `type ${methodTypeName}Parameters = {}\n`;
    // }

    if (methodValue.responses['200']) {
      pathTypes +=
        createTypeFromResponseSchema(
          `${methodTypeName}Response`,
          methodValue.responses['200'].schema
        ) + '\n';
    }
  }

  return pathTypes;
}

function createTypeFromResponseSchema(name, schema) {
  let typeDefinition = '';

  if (schema.$ref || schema.type) {
    typeDefinition += `type ${name} = `;
    let tsType = convertSchemaToType(schema);
    typeDefinition += `${tsType}`;
    return typeDefinition;
  }

  console.warn(
    `Missing $ref or type property in response schema. Skipping generating type for ${name}.`
  );
}

function createTypeFromDefinition([definitionKey, definitionValue]) {
  let definitionEntries = Object.entries(definitionValue.properties);
  let typeDefinition = '';

  typeDefinition += `type ${definitionKey} = {\n`;

  definitionEntries.forEach(([propertyKey, propertyValue]) => {
    let tsType = convertSchemaToType(propertyValue);
    typeDefinition += `${propertyKey}: ${tsType};\n`;
  });

  typeDefinition += '}\n';

  return typeDefinition;
}

measureDuration(main.bind(null, minimist(process.argv.slice(2))));
