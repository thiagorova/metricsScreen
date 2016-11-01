angular.module('metricsApp').controller('chartsController', function($scope, $rootScope){
  var metrics = new Metrics("eJwNyDsOgDAMBNETgTZre+10XAVSICQ+9++INHrFELAQmEF3V/OiuhhtPqUbyAT6wmpUWc7Qw8mqtGaQDBMVIoy2jO+493c7n/261/E9P8cBFlU=");
  var lineGraph = new LineGraph();

  $scope.openProject = function(){
    $scope.dProject = $rootScope.project;  //the project is passed in this var now: $rootScope.project
    metrics.getMetrics($scope.dProject.id, function (metrics) {
      if(metrics !== "") {
        lineGraph.clear();
        lineGraph.build(430, 240);
        lineGraph.setDateFormat("day_whole");
        lineGraph.setData(metrics);
      }
    });
  };
    $scope.openProject();

  $scope.startMeasuring = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "start", project: $scope.dProject.id}, null);
    });
  };

  $scope.stopMeasuring = function(project) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "stop", project: $scope.dProject.id}, null);
    });
  };
});
