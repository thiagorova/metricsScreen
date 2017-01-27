  var count = 1000;
  var start, timeoutId, projectTime;
  var time = 0;
  var dProject;
  var metricsApi;
  var projectMetrics;

  var openProject = function(callback){
    var createdProject = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "getData"}, function (project) {
        dProject = project;

        document.getElementById("projectName").innerHTML = dProject.projectName  ;
        document.getElementById("projectTime").innerHTML = dProject.time  + "h";
        document.getElementById("wordCount").innerHTML = dProject.words;
        document.getElementById("milestonePercentage").innerHTML = dProject.milestone.percentage + "%" ;
        if (dProject.milestone.words) {
          var milestoneText = dProject.milestone.words + " WORDS PER DAY";
        } else {
          var milestoneText = dProject.milestone.deadline.replace("/20", "/");
        }
        document.getElementById("milestoneText").innerHTML = milestoneText  ;
        metricsApi.getMetrics(dProject.id, function (metricsData) {
          projectMetrics = metricsData;
          if(metricsData !== "") {
            
            buildGraph(metricsData);
            wordsPerHour(metricsData);
          } else {
            var canvas = document.getElementsByTagName("canvas");
            if (canvas) canvas.parentNode.removeChild(element);
          }
        });
        callback();
      });
    });
  }



  function measuring() {
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "inline-block";
    document.getElementById("chartsBack").disabled = true;
    document.getElementById("createProject").disabled = true;
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
    document.getElementById("createProject").disabled = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.browserAction.setIcon({
        path : "img/icons/imgpsh_fullsize.png",
        tabId: tabs[0].id
      });
    });
    clearTimeout(timeoutId);
    if (typeof projectTime !== "undefined") {
      var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
      metricsApi.setDuration(dProject.id, seconds);
    }
  }

//setting the messages to start recording the data
  startMeasuring = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "start", project: dProject.id}, null);
    });
    measuring();
  };

  var stopMeasuring = function(project) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "stop", project: dProject.id}, null);
    });
    stopped();
  };

function instance() {
    time += count;
    var elapsed = Math.floor(count/1000);
    projectTime.setSeconds(projectTime.getSeconds() + elapsed);
    dProject.time = projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString();
    var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
    if (time % 60000 === 0) metricsApi.setDuration(dProject.id, seconds);
    document.getElementById("projectTime").innerHTML = dProject.time
    var diff = (new Date().getTime() - start) - time;
    timeoutId = window.setTimeout(instance, (count - diff));
}

  function setCounter() {
    projectTime = new Date();
    var parts = dProject.time.match(/(\d+):(\d+):(\d+)/);
    projectTime.setHours(parseInt(parts[1], 10));
    projectTime.setMinutes(parseInt(parts[2], 10));
    projectTime.setSeconds(parseInt(parts[3], 10)); projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString();
    start = new Date().getTime();
    timeoutId = window.setTimeout(instance, count);
  }

  function setData(metricsData) {
    var data = [],
    dataPos,
    knownDataLen,
    current,
    len = metricsData.length;
  for (var i = 0; i < len; i++) {
    current = metricsData[i].date.split(" ")[0]
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
      datum.count = metricsData[i].count;
      datum.fdate = metricsData[i].date;
      datum.day = current;
      data.push(datum)
    } else {
      if (datum.fdate.split(" ")[1] < metricsData[i].date.split(" ")[1]) {
        data[dataPos].count = metricsData[i].count;
        data[dataPos].fdate = metricsData[i].date;
      }
    }
  }
  return data;
  }


  function buildGraph(metricsData) {
    // Any of the following formats may be used
    var data = setData(metricsData);
    data.sort(function(a,b) {
      a = a.day.split('/').reverse().join('');
      b = b.day.split('/').reverse().join('');
      return a > b ? 1 : a < b ? -1 : 0;
    });
    var numWords = data.map(function (datum) {return datum.count;});
    var dates = data.map(function (datum) {return datum.day;});
    drawChart(dates, numWords);
  }

  var drawChart = function(dates, numWords) {
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

function goBack() {
  changeLocation("projects.html");
}

function chart_startSystem() {
  document.getElementById("chartsBack").addEventListener('click', goBack);
  document.getElementById("start").addEventListener('click', startMeasuring);
  document.getElementById("pause").addEventListener('click', stopMeasuring);
  setSystem(function (metrics) {
     metricsApi = metrics;
    openProject(function () {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {request: "isMeasuring"}, function(response) {
          if (response === true) {
            measuring();
          } else {
            stopped();
          }
        });
    });
  });
  });
}
