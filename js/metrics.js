var metrics = angular.module('metricsApp', ['ui.router']);
metrics.config(function($stateProvider) {
  var states = [
    { 
      name: 'empty',
      url: '/empty',
      templateUrl: 'empty.html'
    }, {
      name: 'projects',
      url: '/projects',
      templateUrl: 'projects.html'
    }, {
      name: 'create',
      url: '/create',
      templateUrl: 'create.html'
    }, {
      name: 'charts',
      url: '/charts',
      templateUrl: 'charts.html'
    }, {
      name: 'setKey',
      url: '/setKey',
      templateUrl: 'setKey.html'
    }
  ]

  // Loop over the state definitions and register them
  states.forEach(function(state) {
    $stateProvider.state(state);
  });

});
