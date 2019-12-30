const {
  extractNameFromNamespace
} = require('./helpers/extract-name-from-namespace');
const { createObjectProperty } = require('./helpers/create-object-property.js');
const { createArray } = require('./helpers/create-array-type.js');

const PRIMITIVE_TYPES = ['number', 'string', 'boolean'];

const SWAGGER_TYPES_TO_TS_TYPES_MAP = new Map([
  ['integer', 'number'],
  ['file', 'File']
]);

function convertSchemaToType(schema) {
  let schemaType = schema.type;

  if (PRIMITIVE_TYPES.includes(schemaType)) {
    return schemaType;
  }

  let mappedType = SWAGGER_TYPES_TO_TS_TYPES_MAP.get(schemaType);

  if (mappedType) {
    return mappedType;
  }

  if (schemaType === 'array') {
    let itemType = convertSchemaToType(schema.items);
    return createArray(itemType);
  }

  if (schemaType === 'object') {
    if (schema.properties) {
      let objectProperties = '{ ';
      let properties = [];

      for (let [objectKey, objectValue] of Object.entries(schema.properties)) {
        let isRequired = schema.required
          ? schema.required.includes(objectKey)
          : false;

        properties.push(
          createObjectProperty(
            objectKey,
            convertSchemaToType(objectValue),
            isRequired
          )
        );
      }

      objectProperties += properties.join(' ');
      objectProperties += ' }';

      return objectProperties;
    } else if (schema.additionalProperties) {
      return '{[key: string]: any}';
    }
  }

  let ref = schema['$ref'];

  if (ref) {
    let refType = ref.split('/').slice(-1)[0];
    let includesNamespace = refType.indexOf('.') !== -1;

    if (includesNamespace) {
      refType = extractNameFromNamespace(refType);
    }

    return refType;
  }

  return 'unknown';
}

module.exports = {
  convertSchemaToType
};
