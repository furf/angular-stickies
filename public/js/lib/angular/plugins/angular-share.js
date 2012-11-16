'use strict';

angular.module('angular-share', [])

/**
 * config
 */
.config(function () {


  var types = sharejs.types,
      text = types.text,
      jsonArray = types['json-array'] = Object.create(text),
      jsonObject = types['json-object'] = Object.create(text);

  jsonArray.create = function () { return []; };
  jsonObject.create = function () { return {}; }


  sharejs.Doc.prototype.setText = function (newValue) {

    var oldValue = this.snapshot,
        commonStart,
        commonEnd,
        oldLength,
        newLength,
        commonSum;

    if (oldValue === newValue) {
      return;
    }

    commonStart = 0;

    while (oldValue.charAt(commonStart) === newValue.charAt(commonStart)) {
      commonStart++;
    }

    commonEnd = 0;
    oldLength = oldValue.length;
    newLength = newValue.length;

    while (oldValue.charAt(oldLength - 1 - commonEnd) === newValue.charAt(newLength - 1 - commonEnd) && commonEnd + commonStart < oldLength && commonEnd + commonStart < newLength) {
      commonEnd++;
    }
    
    commonSum = commonStart + commonEnd;

    if (oldLength !== commonSum) {
      this.del(commonStart, oldLength - commonStart - commonEnd);
    }
    
    if (newLength !== commonSum) {
      this.insert(commonStart, newValue.slice(commonStart, newLength - commonEnd));
    }
  };
})

/**
 * $share
 */
.factory('$share', ['$rootScope', function ($rootScope) {

  var $scope = $rootScope.$new(),
      unwatch = {};
 
  return {

    open: function (id, type, options) {

      type || (type = 'text');
      options || (options = '//' + location.host + '/channel');

      $scope[id] = sharejs.types[type].create();

      sharejs.open(id, type, options, function (err, remote) {
        // console.log('$share.open', arguments);
        if (err) throw new Error(err);

        // Local changes -> serialize to network
        unwatch[id] = $scope.$watch(id, function serialize () {
          // console.log('serialize', JSON.stringify($scope[id]));
          remote.setText(JSON.stringify($scope[id]));

          // TEMPORARY UNTIL SOMETHING PRETTIER COMES ALONG!
          // if ($scope[id].persist) {
          //   setTimeout(function () {
          //     delete $scope[id].persist;              
          //   });
          //   // console.log('persist?', !!$scope[id].persist);
          // }

        }, true);

        // Remote changes -> deserialize to DOM
        remote.on('remoteop', deserialize);

        function deserialize () {
          $scope.$apply(function () {
            // console.log('deserialize', remote.snapshot);
            angular.copy(JSON.parse(remote.snapshot), $scope[id]);
          });
        }

        if (remote.version > 0) {
          deserialize();
        }

      });

      return $scope[id];
    },

    close: function (id) {
      // console.log('$share.close', id);
      unwatch[id]();
      delete unwatch[id]; 
      delete $scope[id];
    }
  };
}]);