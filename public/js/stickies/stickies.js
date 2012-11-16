'use strict';

angular.module('stickies', [
  'angular-share',
  'angular-jquery-ui',
  'angular-uuid'
]);

angular.module('stickies').config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/:id', {
      templateUrl: 'js/stickies/templates/notes.html',
      controller: 'NotesController'
    });

    $routeProvider.otherwise({ redirectTo: '/hello' });

}]);