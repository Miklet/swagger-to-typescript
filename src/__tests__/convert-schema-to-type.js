const { convertSchemaToType } = require('../convert-schema-to-type');

test.each`
  type         | expectedResult
  ${'number'}  | ${'number'}
  ${'boolean'} | ${'boolean'}
  ${'string'}  | ${'string'}
`('converts primitive types', ({ type, expectedResult }) => {
  let result = convertSchemaToType({
    type
  });

  expect(result).toBe(expectedResult);
});

test.each`
  type         | expectedResult
  ${'integer'} | ${'number'}
  ${'file'}    | ${'File'}
`('converts swagger types to typescript types', ({ type, expectedResult }) => {
  let result = convertSchemaToType({
    type
  });

  expect(result).toBe(expectedResult);
});

test.each`
  itemsType    | expectedResult
  ${'integer'} | ${'Array<number>'}
  ${'boolean'} | ${'Array<boolean>'}
  ${'string'}  | ${'Array<string>'}
`('converts array of primitive type', ({ itemsType, expectedResult }) => {
  let result = convertSchemaToType({
    type: 'array',
    items: {
      type: itemsType
    }
  });

  expect(result).toBe(expectedResult);
});

test('converts array of $ref type', () => {
  let result = convertSchemaToType({
    type: 'array',
    items: {
      $ref: '#/definitions/ReusableType'
    }
  });

  expect(result).toBe('Array<ReusableType>');
});

test('converts $ref type', () => {
  let result = convertSchemaToType({
    $ref: '#/definitions/ReusableType'
  });

  expect(result).toBe('ReusableType');
});

test.each`
  type
  ${'foo'}
  ${'bar'}
  ${'baz'}
`('converts unknown types to unknown', ({ type }) => {
  let result = convertSchemaToType({
    type
  });

  expect(result).toBe('unknown');
});

test('converts flat objects', () => {
  let result = convertSchemaToType({
    type: 'object',
    properties: {
      key1: {
        type: 'number'
      },
      key2: {
        type: 'string'
      },
      key3: {
        type: 'boolean'
      }
    }
  });

  expect(result).toMatchInlineSnapshot(
    `"{ key1?: number; key2?: string; key3?: boolean; }"`
  );
});
