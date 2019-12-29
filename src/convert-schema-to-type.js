// @ts-check

const PRIMITIVE_TYPES = ['number', 'string', 'boolean', 'integer'];

const SWAGGER_TYPES_TO_TS_TYPES_MAP = new Map([['integer', 'number']]);

function convertSchemaToType(schema) {
  let schemaType = schema.type;

  if (PRIMITIVE_TYPES.includes(schemaType)) {
    let mappedType = SWAGGER_TYPES_TO_TS_TYPES_MAP.get(schemaType);

    if (mappedType) {
      return mappedType;
    }
    return schemaType;
  }

  if (schemaType === 'array') {
    let itemType = convertSchemaToType(schema.items);
    return `Array<${itemType}>`;
  }

  if (schemaType === 'object') {
    if (schema.properties) {
      let objectProperties = '{ ';

      for (let [objectKey, objectValue] of Object.entries(schema.properties)) {
        objectProperties += `${objectKey}: ${objectValue.type} `;
      }

      objectProperties += '}';

      return objectProperties;
    } else if (schema.additionalProperties) {
      return '{[key: string]: any}';
    }
  }

  let ref = schema['$ref'];

  if (ref) {
    let refType = ref.split('/').slice(-1)[0];
    return refType;
  }

  return 'unknown';
}

module.exports = {
  convertSchemaToType
};
