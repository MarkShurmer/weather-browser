'use strict';

angular.module('myApp', [])
  .config(['$locationProvider', function ($locationProvider) {
    $locationProvider.hashPrefix('!');

  }])
  .constant('dateFormat', dateFormat);
