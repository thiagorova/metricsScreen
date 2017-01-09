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
       buildGraph(metrics);
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

  function setData(metrics) {
    var data = [], 
    dataPos, 
    knownDataLen, 
    current,
    len = metrics.length;
  for (var i = 0; i < len; i++) {
    current = metrics[i].date.split(" ")[0]
    knownDataLen = data.length;
    dataPos = -1;
    for (var j = 0; j < knownDataLen; j++) {
      if (data[j].day === current) {
        dataPos = j; 
        break;
      }
    }
    if (dataPos < 0) {
      var datum = {};
      datum.count = metrics[i].count;
      datum.fdate = metrics[i].date;
      datum.day = current;
      data.push(datum)
    } else {
      if (datum.fdate.split(" ")[1] < metrics[i].date.split(" ")[1]) {
        data[dataPos].count = metrics[i].count;
        data[dataPos].fdate = metrics[i].date;
      }
    }
  }
  console.log(data);
  return data;
  }

  function buildGraph(metrics) {
    // Any of the following formats may be used
    var data = setData(metrics);
    data.sort(function(a,b) {
      a = a.day.split('/').reverse().join('');
      b = b.day.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
    var numWords = data.map(function (datum) {return datum.count;});
    var dates = data.map(function (datum) {return datum.day;});
    $scope.drawChart(dates, numWords);
  }
  
  $scope.drawChart = function(dates, numWords) {
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: dates,
        datasets: [{
          label: '# of Words',
          data: numWords,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
  });
}
});
