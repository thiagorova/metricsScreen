  var count = 1000;
  var start, timeoutId, projectTime;
  var time = 0;
  var dProject;
  var metricsApi;
  var projectMetrics;


function startSystem() {
  document.getElementById("chartsBack").addEventListener('click', goBack);
  document.getElementById("start").addEventListener('click', startMeasuring);
  document.getElementById("pause").addEventListener('click', stopMeasuring);
  document.getElementById("showMore").addEventListener('click', changeView);
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

  var openProject = function(callback){
    var createdProject = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "getData"}, function (project) {
        dProject = project;

        document.getElementById("projectName").innerHTML = dProject.projectName;
        document.getElementById("projectTime").innerHTML = dProject.time  + "h";
        document.getElementById("wordCount").innerHTML = dProject.words;
        document.getElementById("milestonePercentage").innerHTML = dProject.milestone.percentage + "%" ;
        if (dProject.milestone.type == "wDay") {
          var milestoneText = dProject.milestone.words + " WORDS PER DAY";
        } else if (dProject.milestone.type == "wMonth") {
          var milestoneText = dProject.milestone.words + " WORDS PER MONTH";
        } else {
          var milestoneText = dProject.milestone.deadline.replace("/20", "/");
        }
        document.getElementById("milestoneText").innerHTML = milestoneText  ;
        metricsApi.getMetrics(dProject.id, function (metricsData) {
          projectMetrics = metricsData;
          if(metricsData !== "") {
            document.getElementById("beganWriting").innerHTML = getStartDate(dProject);
            document.getElementById("lastUpdate").innerHTML = getLastUpdate(dProject);
            document.getElementById("characterCount").innerHTML = getCharacterCount(dProject);
            buildGraph(metricsData);
            wordsPerHour(metricsData);

          } else {
            document.getElementById("beganWriting").innerHTML = dProject.creation;
            document.getElementById("lastUpdate").innerHTML = dProject.creation;
            document.getElementById("characterCount").innerHTML = 0;
            var canvas = document.getElementsByTagName("canvas")[0];
            if (canvas) canvas.parentNode.removeChild(canvas);
          }
        });
        callback();
      });
    });
  }

  function getStartDate(project) {
    return project.creation;
  }
  function getLastUpdate(project) {
    var date = new Date(project.lastUpdate);
    return date.getDate() + '/' + date.getMonth()+1 + '/' + date.getFullYear();
  }
  function getCharacterCount(project) {
    return project.charCount;
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
  }

//setting the messages to start recording the data
  startMeasuring = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "start", project: dProject.id, time: dProject.time}, null);
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
    dProject.time = projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString() + "h";
    var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
    document.getElementById("projectTime").innerHTML = dProject.time
    var diff = (new Date().getTime() - start) - time;
    timeoutId = window.setTimeout(instance, (count - diff));
}

  function setCounter() {
    projectTime = new Date();
    var parts = dProject.time.match(/(\d+):(\d+):(\d+)/);
    projectTime.setHours(parseInt(parts[1], 10));
    projectTime.setMinutes(parseInt(parts[2], 10));
    projectTime.setSeconds(parseInt(parts[3], 10)); 
    projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString();
    start = new Date().getTime();
    timeoutId = window.setTimeout(instance, count);
  }

  function changeView () {
    var height = document.getElementById("sometimes").style.height;
    var time = 450;
    if (height === "0px" || height === "") {
      $('#sometimes').animate({
        height: '100px'
      }, {
        duration: time  // 2 seconds
      });
      $('.authorship-metrics-indicators').animate({
        height: '235px'
      }, {
        duration: time  // 2 seconds
      });
      $('.more ').addClass("less").removeClass("more");
    } else {
      $('#sometimes').animate({
        height: '0px'
      }, {
        duration: time  // 2 seconds
      });
      $('.authorship-metrics-indicators').animate({
        height: '105px'
      }, {
        duration: time  // 2 seconds
      });
      $('.less ').addClass("more").removeClass("less");
    }
  }

  function goBack() {
    changeLocation("projects.html");
  }
