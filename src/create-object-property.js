function createObjectProperty(key, value, isRequired) {
  let objectProperty = key;

  if (!isRequired) {
    objectProperty += '?';
  }

  objectProperty += `: ${value};`;

  return objectProperty;
}

module.exports = {
  createObjectProperty
};
