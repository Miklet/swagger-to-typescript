const {
  createTypeFromDefinitionEntry
} = require('../create-type-from-definition-entry');

test('creates type from definition entry', () => {
  let result = createTypeFromDefinitionEntry([
    'Definition',
    {
      properties: {
        key1: {
          type: 'string'
        },
        key2: {
          type: 'integer'
        },
        key3: {
          type: 'array',
          items: {
            type: 'number'
          }
        }
      },
      required: ['key1', 'key2']
    }
  ]);

  expect(result).toMatchInlineSnapshot(
    `"type Definition = { key1: string; key2: number; key3?: Array<number>; }"`
  );
});

test('creates type from definition entry with nested object', () => {
  let result = createTypeFromDefinitionEntry([
    'Definition',
    {
      properties: {
        key1: {
          type: 'object',
          properties: {
            key1_1: {
              type: 'string'
            },
            key1_2: {
              $ref: '#/definitions/AnotherDefinition'
            }
          },
          required: ['key1_1', 'key1_2']
        },
        key2: {
          type: 'object',
          properties: {
            key2_1: {
              type: 'boolean'
            },
            key2_2: {
              type: 'array',
              items: {
                type: 'number'
              }
            }
          },
          required: ['key2_2']
        }
      },
      required: ['key1']
    }
  ]);

  expect(result).toMatchInlineSnapshot(
    `"type Definition = { key1: { key1_1: string; key1_2: AnotherDefinition; }; key2?: { key2_1?: boolean; key2_2: Array<number>; }; }"`
  );
});

test("extracts defnition's name when name includes namespace", () => {
  let result = createTypeFromDefinitionEntry([
    'Api.Controllers.ControllerDefinition.Definition',
    {
      properties: {
        key1: {
          type: 'object',
          properties: {
            key1_1: {
              type: 'string'
            },
            key1_2: {
              $ref: '#/definitions/AnotherDefinition'
            }
          },
          required: ['key1_1', 'key1_2']
        }
      }
    }
  ]);

  expect(result).toMatchInlineSnapshot(
    `"type Definition = { key1?: { key1_1: string; key1_2: AnotherDefinition; }; }"`
  );
});
