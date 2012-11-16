var sharejs = require('share'),
    jsonArray = Object.create(sharejs.types.text);

jsonArray.create = function () {
  return '[]';
};

module.exports = jsonArray;
