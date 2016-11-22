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

myApp.controller('indexController', function($scope, $location, $state, $window){

  if (navigator.onLine === true) {
    document.getElementById("online_offline").innerHTML = "User is online";
    checkStorage();
  } else {
    document.getElementById("online_offline").innerHTML = "User is offline";
  }
  
  $scope.updateOnlineStatus = function () {
    document.getElementById("online_offline").innerHTML = "User is online";
  }

  $scope.updateOfflineStatus = function () {
    document.getElementById("online_offline").innerHTML = "User is offline";
  }
  
  $window.addEventListener('online',  $scope.updateOnlineStatus);
  $window.addEventListener('offline', $scope.updateOfflineStatus);
  
  //  $scope.metrics = new Metrics("eJwNyDsOgDAMBNETgTZre+10XAVSICQ+9++INHrFELAQmEF3V/OiuhhtPqUbyAT6wmpUWc7Qw8mqtGaQDBMVIoy2jO+493c7n/261/E9P8cBFlU=");
  $scope.metrics = new Metrics("eJxFijkOgEAMxF4EmiSbYzq+QoEEBQJx/B+o6CzbkhWhYciISDjhBnWzlgSFns5K6xT1BjaWahHvE8Zm5oHPOkSqqXTjfc3bcc7LPvzYr9MDnkAaIw==");
  $state.go("projects");
  
  
  function checkStorage() {
    chrome.storage.local.get('newProjects', function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        storedItem.newProjects.forEach(function(project)  {
          $scope.metrics.createProject(project.projectName, project.totalWords, project.selectMilestone, project.milestoneMeasure);
        });
      }
    });
    chrome.storage.local.get(null, function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        for (var property in storedItem) {
          if (storedItem.hasOwnProperty(property)) {
            if (property.match(/project\d+/)) {
              console.log(property);
              var id = parseInt(property.replace("project", ""));
              storedItem[property].data.forEach(function (metric) {
                metrics.saveLater(projectId, metric.time, metric.message);
              });
            }
          }
        }
      }
      chrome.storage.local.clean();
    });
  }
  
});
