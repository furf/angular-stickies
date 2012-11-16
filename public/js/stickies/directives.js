'use strict';

angular.module('stickies').directive('contenteditable', function () {
  return {
    restrict: 'A',
    require: '?ngModel',
    link: function (scope, element, attrs, ngModel) {

      if (!ngModel) return;

      ngModel.$render = function () {
        element.html(ngModel.$viewValue || '');
      };

      element.on('blur keyup change cut paste input', function (event) {
        scope.$apply(read);
      });

      function read () {
        ngModel.$setViewValue(element.html());
      }

    }
  };
});


angular.module('stickies').directive('editor', function () {

  var commands = {
        66: 'bold',
        72: function () {
          document.execCommand('createlink', false, window.prompt('Please specify a URL:'));
        },
        73: 'italic',
        76: 'insertunorderedlist',
        79: 'insertorderedlist',
        85: 'underline',
        219: 'outdent',
        221: 'indent'
      };

  angular.forEach(commands, function (command, key) {
    if (!angular.isFunction(command)) {
      commands[key] = function () {
        document.execCommand(command, false, null);
      };
    }
  });

  return {
    restrict: 'A',
    link: function (scope, element, attrs) {

      element.on('keydown', function (event) {

        var command;
        if (event.metaKey) {
          command = commands[event.keyCode];
          if (command) {
            command();
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();
          }
        }
      });
    }
  };
});





// angular.module('stickies').directive('disableSelection', function () {
//   return {
//     restrict: 'A',
//     link: function (scope, element, attrs) {
//       var el = element[0],
//           eventType = 'onselectstart' in el ? 'selectstart' : 'mousedown';
//       return element.on(eventType, function (event) {
//         if (event.target === el) {
//           event.preventDefault();  
//         }
//       });
//     }
//   };
// });

// angular.module('stickies').directive('ngFocus', function () {
//   return {
//     restrict: 'A',
//     link: function (scope, element, attrs) {

//       element.on('focus', function () {
//         scope.$eval(attrs.ngFocus);
//       });

//     }
//   };
// });

// angular.module('stickies').directive('ngBlur', function () {
//   return {
//     restrict: 'A',
//     link: function (scope, element, attrs) {

//       element.on('blur', function () {
//         scope.$eval(attrs.ngBlur);
//       });

//     }
//   };
// });

