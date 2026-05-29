const toStringId = (value) => {
  if (value === null || value === undefined) return null;
  return value.toString();
};

module.exports = {
  toStringId,
};
