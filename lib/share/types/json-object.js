var sharejs = require('share'),
    jsonObject = Object.create(sharejs.types.text);

jsonObject.create = function () {
  return '{}';
};

module.exports = jsonObject;
