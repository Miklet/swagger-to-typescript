const { createObjectProperty } = require('./create-object-property.js');
const { convertSchemaToType } = require('../convert-schema-to-type');

function createObjectTypeString(properties, required) {
  let stringProperties = [];

  for (let [objectKey, objectValue] of Object.entries(properties)) {
    let isRequired = required ? required.includes(objectKey) : false;

    stringProperties.push(
      createObjectProperty(
        objectKey,
        convertSchemaToType(objectValue),
        isRequired
      )
    );
  }

  let stringObject = `{ ${stringProperties.join(';')} }`;
  return stringObject;
}

module.exports = {
  createObjectTypeString
};
