const { createObjectProperty } = require('./helpers/create-object-property');
const { convertSchemaToType } = require('./convert-schema-to-type');

function createTypesFromPathEntry([pathKey, pathValue]) {
  let methodsEntries = Object.entries(pathValue);
  let pathTypes = '';

  for (let methodEntry of methodsEntries) {
    let [methodKey, methodValue] = methodEntry;

    let typeName = capitalizeFirstLetter(methodValue.operationId);

    if (methodValue.parameters.length > 0) {
      let parametersType = '/**\n';

      if (methodValue.description) {
        parametersType += `* ${methodValue.description}\n`;
      }

      parametersType += `* Method: ${methodKey.toUpperCase()}\n`;
      parametersType += `* Path: ${pathKey}\n`;
      parametersType += '**/\n';

      parametersType += createInputTypeFromMethodParameters(
        typeName,
        methodValue.parameters
      );

      if (parametersType) {
        pathTypes += `${parametersType}\n`;
      }
    }

    if (methodValue.responses['200']) {
      let responseType = createTypeFromResponse(
        typeName,
        methodValue.responses['200']
      );
      if (responseType) {
        pathTypes += `${responseType}\n`;
      }
    }
  }

  return pathTypes;
}

function capitalizeFirstLetter(value) {
  return `${value.slice(0, 1).toUpperCase()}${value.slice(1)}`;
}

function createInputTypeFromMethodParameters(name, parameters) {
  let parametersType = `type ${name}Parameters = {\n`;

  for (let parameter of parameters) {
    let tsType = convertSchemaToType(
      parameter.schema ? parameter.schema : parameter
    );

    if (parameter.description) {
      parametersType += `
        /**
         * ${parameter.description}
         **/\n`;
    }

    parametersType += createObjectProperty(
      parameter.name,
      tsType,
      parameter.required
    );
  }

  parametersType += '}\n';

  return parametersType;
}

function createTypeFromResponse(name, response) {
  if (response.schema) {
    let typeDefinition = '';

    if (response.schema.$ref || response.schema.type) {
      typeDefinition += `type ${name}Response = `;
      let tsType = convertSchemaToType(response.schema);
      typeDefinition += `${tsType}\n`;
      return typeDefinition;
    }
  }
}

module.exports = {
  createTypesFromPathEntry
};
