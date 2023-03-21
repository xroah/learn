function isObject(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]"
}

function getObjectKeysAndValues(obj) {
  let keys = [];
  let values = [];
  for (let key in obj) {
      keys.push(key);
      values.push(obj[key]);
  }
  return {keys, values};
}

module.exports = {
  isObject,
  getObjectKeysAndValues
};