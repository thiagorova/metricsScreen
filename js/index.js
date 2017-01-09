metrics.controller('indexController', function($scope, $state, $window, $rootScope){
  $scope.updateOnlineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Online mode";
    checkStorage();
  }

  $scope.updateOfflineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Offline mode";
  }

  $scope.goToAuthorship = function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "http://www.authorship.me"});
    return false;
  }

  var checkStorage = function() {
    chrome.storage.local.get('newProjects', function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        storedItem.newProjects.forEach(function(project)  {
          $rootScope.metrics.createProject(project.projectName, project.totalWords, project.selectMilestone, project.milestoneMeasure);
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
  
  $scope.sendProject = function(project){
    $rootScope.project = project;
  };
  
  $scope.setSystem = function () {
    $rootScope.metrics;
    $window.addEventListener('online',  $scope.updateOnlineStatus);
    $window.addEventListener('offline', $scope.updateOfflineStatus);
    document.getElementById("authorshipLink").addEventListener('click', $scope.goToAuthorship);
    chrome.storage.local.get('apikey', function(storedItem) {
      if(angular.equals(storedItem, {})  === false) {
        $rootScope.metrics = new Metrics(storedItem.apikey);
        if (navigator.onLine === true) {
          $scope.updateOnlineStatus();
        } else {
          $scope.updateOfflineStatus();
        }  
        testOpenProject();
      } else {
        $state.go("setKey");
      }
    });
  }
  
  testOpenProject = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "getId"}, function (projectId) {
        if(projectId == null) {
          $scope.$apply(function() {
            $state.go('projects');
          });
        } else {
          $rootScope.metrics.getProject(projectId, GoToProject,
            function(error) {
              getFromStorage(projectId, GoToProject);
            });
          }
      });
    });
  }

  function GoToProject(project) {
    $scope.$apply(function() {
      var setProject = (project.constructor === Array) ? 
        setProjects(project):
        setProjects([project]);
      $scope.sendProject(setProject[0]);
      $state.go('charts');
    });
  }
  
  $scope.setSystem();
});
