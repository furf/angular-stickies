'use strict';

angular.module('angular-jquery-ui', []);

angular.forEach({

  Button: ['Create'],
  Draggable: ['Create', 'Start', 'Drag', 'Stop'],
  Droppable: ['Create', 'Activate', 'Deactivate', 'Over', 'Out', 'Drop'],
  Resizable: ['Create', 'Start', 'Resize', 'Stop'],
  Sortable: 'Create Start Sort Change BeforeStop Stop Update Receive Remove Over Out Activate Deactivate'.split(' ')

}, function (eventTypes, key) {

  var name = 'ui' + key,
      method = key.toLowerCase();

  angular.module('angular-jquery-ui').directive(name, ['$parse', function ($parse) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {

        var options = attrs[name] ? $parse(attrs[name])() : {};

        angular.forEach(eventTypes, function (eventType) {

          var attr = attrs[name + eventType],
              callback;

          if (attr) {
            callback = $parse(attr);
            options[eventType.toLowerCase()] = function (event, ui) {
              scope.$apply(function() {
                callback(scope, {
                  $event: event,
                  $ui: ui
                });
              });
            };
          }

        });

        element[method](options);

      }
    };
  }]);

});