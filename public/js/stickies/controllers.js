'use strict';

angular.module('stickies').controller('NotesController', [
  '$scope', '$routeParams', '$share', '$uuid', function ($scope, $routeParams, $share, $uuid) {


  $scope.$on('specialEvent', function () {
    console.log('special event heard', arguments);
  })

  $scope.notes = $share.open($routeParams.id, 'json-array');

  $scope.colors = ['yellow', 'blue', 'green', 'pink', 'purple'];



  $scope.colorMenuIsVisible = false;

  $scope.showColorMenu = function () {
    console.log('show');
    $scope.colorMenuIsVisible = true;
  };
  
  $scope.hideColorMenu = function () {
    console.log('hide');
    $scope.colorMenuIsVisible = false;
  };

  $scope.toggleColorMenu = function () {
    console.log('was', $scope.colorMenuIsVisible);
    $scope.colorMenuIsVisible = !$scope.colorMenuIsVisible;
    console.log('is', $scope.colorMenuIsVisible);
  };


  $scope.activeColor = 'yellow';  

  $scope.setActiveColor = function (color) {
    $scope.activeColor = color;
    var focusedNote = $scope.getFocusedNote();
    if (focusedNote) {
      $scope.setColor(focusedNote, color);
    }
  };

  $scope.isActiveColor = function (color) {
    return color === $scope.activeColor;
  }

  $scope.isNotActiveColor = function (color) {
    return color !== $scope.activeColor;
  }



  $scope.hoveredColor = 'yellow';  

  $scope.setHoveredColor = function (color) {
    $scope.hoveredColor = color;
  };

  $scope.isHoveredColor = function (color) {
    return color === $scope.hoveredColor;
  }




  var focused;

  $scope.getFocusedNote = function () {
    
    if (!focused) return;
    
    var notes = $scope.notes,
        i = notes.length;
    
    while (i--) {
      if (notes[i].id === focused) {
        return notes[i];
      }
    }
  };


  /**
   * 
   */
  $scope.createFromDblClick = function (event) {

    if (event.target !== event.currentTarget) return;

    $scope.create({
      x: Math.min(Math.max(event.offsetX - 100, 0), event.target.offsetWidth - 200),
      y: Math.min(Math.max(event.offsetY - 10, 0), event.target.offsetHeight - 200)
    });
  };

  $scope.create = function (options) {

    var notes = $scope.notes,
        note;

    note = angular.extend({
      id: $uuid(),
      text: '',
      color: $scope.activeColor,
      x: 60,
      y: 10,
      z: notes.length,
      w: 200,
      h: 200,
      isMinimized: false
    }, options);

    notes.push(note);
    $scope.focus(note);
  };


  /**
   * 
   */
  $scope.destroy = function (note) {
    var notes = $scope.notes,
        idx = notes.indexOf(note);
    if (idx !== -1) {
      notes.splice(idx, 1);
    }
  };

  /**
   * 
   */
  $scope.setPosition = function (note, position) {
    note.x = position.left;
    note.y = position.top;
  };

  /**
   * 
   */
  $scope.setSize = function (note, size) {
    note.w = size.width;
    note.h = size.height;
  };

  /**
   * 
   */
  $scope.setColor = function (note, color) {
    note.color = color;
  };

  /**
   * 
   */
  $scope.minimize = function (note, minimizeAll) {

    var isMinimized = !note.isMinimized,
        notes, 
        i;

    if (minimizeAll) {
      notes = $scope.notes;
      i = notes.length;
      while (i--) {
        notes[i].isMinimized = isMinimized;
      }
    } else {
      note.isMinimized = isMinimized;
    }
  };

  /**
   * 
   */

  /**
   * 
   */
  $scope.focus = function (note) {

    var notes = $scope.notes,
        i = notes.length,
        z = note.z;

    note.z = i;
    focused = note.id;
    $scope.activeColor = note.color;

    while (i--) {
      if (notes[i].z > z) {
        notes[i].z -= 1;
      }
    }
  };

  $scope.isFocused = function (note) {
    return note.id === focused;
  };

  var hovered;

  $scope.hover = function (note) {
    hovered = note.id;
  };

  $scope.unhover = function () {
    hovered = null;
  };

  $scope.isHovered = function (note) {
    return note.id === hovered;
  };

}]);