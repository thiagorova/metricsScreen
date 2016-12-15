var myApp = angular.module('metricsApp', ['ui.router']);
myApp.config(function($stateProvider) {
  var states = [
    {
      name:'none',
      url:'/',
      templateUrl:'projects.html'
    }, {
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

myApp.controller('indexController', function($scope, $location, $state, $window, $rootScope){
  $rootScope.metrics;
  $scope.updateOnlineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Online mode";
    checkStorage();
  }

  $scope.updateOfflineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Offline mode";
  }
  
  $window.addEventListener('online',  $scope.updateOnlineStatus);
  $window.addEventListener('offline', $scope.updateOfflineStatus);
  
  $scope.goToAuthorship = function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "http://www.authorship.me"});
    return false;
  }
  
  document.getElementById("authorshipLink").addEventListener('click', $scope.goToAuthorship);
  var checkStorage = function() {
    chrome.storage.local.get('newProjects', function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        storedItem.newProjects.forEach(function(project)  {
          $rootScope.metrics.metrics.createProject(project.projectName, project.totalWords, project.selectMilestone, project.milestoneMeasure);
          chrome.storage.local.remove('newProjects');
        });
      }
    });
    chrome.storage.local.get(null, function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        for (var property in storedItem) {
          if (storedItem.hasOwnProperty(property)) {
            if (property.match(/project\d+/)) {
              var id = parseInt(property.replace("project", ""));
              storedItem[property].data.forEach(function (metric) {
                $rootScope.metrics.saveLater(metric.text, id, metric.time);
              });
            }
          }
        }
      }
    });
  }
  
  
  
});
