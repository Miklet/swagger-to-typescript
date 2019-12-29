const { createObjectProperty } = require('./create-object-property');
const { convertSchemaToType } = require('./convert-schema-to-type');

function createTypesFromDefinitionEntry([definitionKey, definitionValue]) {
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

module.exports = {
  createTypesFromDefinitionEntry
};
