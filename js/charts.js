angular.module('metricsApp').controller('chartsController', function($scope, $rootScope){
//generating the graph
  var lineGraph = new LineGraph();
  var count = 1000;
  var start, timeoutId, projectTime;
  var time = 0;
  
  $scope.openProject = function(){
    $rootScope.createdProject = false;
    $scope.dProject = $rootScope.project;  //the project is passed in this var now: $rootScope.project
    $rootScope.metrics.getMetrics($scope.dProject.id, function (metrics) {
      if(metrics !== "") {
       var graph = document.getElementById("graph");
       if (graph === null)  {
         graph = document.createElement("div");
         graph.id = "graph";
         document.getElementById("projectView").insertBefore(graph, document.getElementById("controls"));
       }
        lineGraph.clear();
        lineGraph.build(440, 240);
        lineGraph.setDateFormat("day_whole");
        lineGraph.setData(metrics);
      }
    });
  };

  function measuring() {
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "inline-block";  
    document.getElementById("chartsBack").disabled = true;
   chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.browserAction.setIcon({
        path : "img/icons/recording.png",
        tabId: tabs[0].id
      });
    });
    setCounter();
  }
  
  function stopped() {
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("pause").style.display = "none";  
    document.getElementById("chartsBack").disabled = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.browserAction.setIcon({
        path : "img/icons/imgpsh_fullsize.png",
        tabId: tabs[0].id
      });
    });
    clearTimeout(timeoutId);
    if (typeof projectTime !== "undefined") {
      var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
      $rootScope.metrics.setDuration($scope.dProject.id, seconds);
    }
  }

//setting the messages to start recording the data
  $scope.startMeasuring = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "start", project: $scope.dProject.id}, null);
    });
    measuring();
  };

  $scope.stopMeasuring = function(project) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "stop", project: $scope.dProject.id}, null);
    });
    stopped();
  };
  
  $scope.openProject();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {request: "isMeasuring", project: $scope.dProject.id}, function(response) {
      if (response === true) {
        measuring();
      } else {
          stopped();
      }
    });
  });

function instance() {
    time += count;
    var elapsed = Math.floor(count/1000);
    projectTime.setSeconds(projectTime.getSeconds() + elapsed);
    $scope.$apply(function(){
      $scope.dProject.time = projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString();
    });
    var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
    if (time % 60000 === 0) $rootScope.metrics.setDuration($scope.dProject.id, seconds);
    var diff = (new Date().getTime() - start) - time;
    timeoutId = window.setTimeout(instance, (count - diff));
}

  function setCounter() {
    projectTime = new Date();
    var parts = $scope.dProject.time.match(/(\d+):(\d+):(\d+)/);
    projectTime.setHours(parseInt(parts[1], 10));
    projectTime.setMinutes(parseInt(parts[2], 10));
    projectTime.setSeconds(parseInt(parts[3], 10));
    start = new Date().getTime();
    timeoutId = window.setTimeout(instance, count);
  }

});
