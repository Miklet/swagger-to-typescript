const { createObjectProperty } = require('./helpers/create-object-property.js');
const { convertSchemaToType } = require('./convert-schema-to-type');

function createTypeFromDefinitionEntry([definitionKey, definitionValue]) {
  let propertiesEntries = Object.entries(definitionValue.properties);
  let requiredProperties = definitionValue.required || [];
  let typeDefinition = '';

  typeDefinition += `type ${definitionKey} = { `;

  propertiesEntries.forEach(([propertyKey, propertyValue], index) => {
    let tsType = convertSchemaToType(propertyValue);
    let isRequired = requiredProperties.includes(propertyKey);
    typeDefinition += createObjectProperty(propertyKey, tsType, isRequired);

    if (index !== propertiesEntries.length - 1) {
      typeDefinition += ' ';
    }
  });

  typeDefinition += ' }';

  return typeDefinition;
}

module.exports = {
  createTypeFromDefinitionEntry
};
