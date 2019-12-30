function extractNameFromNamespace(nameWithNamespace) {
  let splittedNameWithNamespace = nameWithNamespace.split('.');
  let name = splittedNameWithNamespace.slice(-1)[0];
  return name;
}

module.exports = {
  extractNameFromNamespace
};
