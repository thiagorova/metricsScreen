var myApp = angular.module('metricsApp', ['ui.router']);
myApp.config(function($stateProvider) {
  var states = [
    {
      name:'none',
      url:'/',
      templateUrl:'projects.html'
    },
    {
      name: 'empty',
      url: '/empty',
      templateUrl: 'empty.html'
    },

    {
      name: 'projects',
      url: '/projects',
      templateUrl: 'projects.html'

    },
    {
      name: 'create',
      url: '/create',
      templateUrl: 'create.html'
    },
    {
      name: 'charts',
      url: '/charts',
      templateUrl: 'charts.html'
    }
  ]

  // Loop over the state definitions and register them
  states.forEach(function(state) {
    $stateProvider.state(state);
  });

});

myApp.controller('indexController', function($scope, $location, $state){
//  $scope.metrics = new Metrics("eJwNyDsOgDAMBNETgTZre+10XAVSICQ+9++INHrFELAQmEF3V/OiuhhtPqUbyAT6wmpUWc7Qw8mqtGaQDBMVIoy2jO+493c7n/261/E9P8cBFlU=");
  $scope.metrics = new Metrics("eJxFijkOgEAMxF4EmiSbYzq+QoEEBQJx/B+o6CzbkhWhYciISDjhBnWzlgSFns5K6xT1BjaWahHvE8Zm5oHPOkSqqXTjfc3bcc7LPvzYr9MDnkAaIw==");
  $state.go("projects");
});
