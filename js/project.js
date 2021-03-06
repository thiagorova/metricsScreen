  var count = 1000;
  var start, timeoutId, projectTime;
  var time = 0;
  var dProject;
  var metricsApi;
  var projectMetrics;


window.onload = function() {
  document.getElementById("chartsBack").addEventListener('click', goBack);
  document.getElementById("start").addEventListener('click', startMeasuring);
  document.getElementById("pause").addEventListener('click', stopMeasuring);
  document.getElementById("showMore").addEventListener('click', changeView);
  testContentScript();
  buildTabs("chart_tab");
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
  var testContentScript = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {request: "exist"}, function(response) {
        if (typeof response !== "undefined") {
            document.getElementById("start").style.display = "inline-block";
            document.getElementById("no-content-script").style.display = "none";
        }
        else {
            document.getElementById("start").style.display = "none";
            document.getElementById("no-content-script").style.display = "block";
        }
    });
  });
  }

  var openProject = function(callback){
    var createdProject = false;
    chrome.storage.local.get('openedP', function(projectId) {
        metrics.getProject(projectId.openedP, function(project) {
          dProject = setProjects([project])[0];
           setScreenInfo(dProject);
          metricsApi.getMetrics(dProject.id, function (metricsData) {
            projectMetrics = metricsData;
            if(metricsData !== "") {
              var firstMetric = metricsData.reduce(function(a, b) {return (a.date < b.date) ?  a: b;});
              var firstDate = firstMetric.date.split(" ")[0] ;
              var firstDate = [firstDate.slice(0, 6), "20", firstDate.slice(6)].join('');
              document.getElementById("beganWriting").innerHTML = firstDate;
              buildGraph(metricsData);
              wordsPerHour(metricsData);
            } else {
              document.getElementById("beganWriting").innerHTML = dProject.creation;
              buildGraph([]);
            }
          }, function (error) {
              document.getElementById("beganWriting").innerHTML = dProject.creation;
              buildGraph([]);
          });
          callback();
          chrome.storage.local.remove('openedP');
        });
      });
  }

  function setScreenInfo(project) {
    document.getElementById("projectName").innerHTML = project.projectName;
    document.getElementById("projectTime").innerHTML = setTimeString(project.time);
    document.getElementById("wordCount").innerHTML = project.words;
    document.getElementById("milestonePercentage").innerHTML = project.milestone.percentage + "%" ;
    document.getElementById("milestoneText").innerHTML = getMilestoneText(project) ;
    document.getElementById("lastUpdate").innerHTML = getLastUpdate(project);
    document.getElementById("characterCount").innerHTML = project.charCount;
  }

  function getMilestoneText(project) {
    if (project.milestone.type == "wDay" || project.milestone.type == "Words per Day") {
      return project.milestone.words + " WORDS PER DAY";
    } else if (dProject.milestone.type == "wMonth") {
      return project.milestone.words + " WORDS PER MONTH";
    } else {
      return project.milestone.deadline.replace("/20", "/");
    }
  }

  function getLastUpdate(project) {
    dateParts = project.lastUpdate.split("T")[0].split("-")
    var date = new Date(dateParts[0], parseInt(dateParts[1])-1, dateParts[2] );
    var day = (date.getDate() < 10) ? "0" + date.getDate():date.getDate();
    var month = (date.getMonth() < 9) ? "0" + (date.getMonth() + 1):date.getMonth() + 1;
    return day + '/' + month + '/' + date.getFullYear();
  }

  function measuring() {
    document.getElementById("start").style.display = "none";
    document.getElementById("pause").style.display = "inline-block";
    document.getElementById("chartsBack").disabled = true;
    document.getElementById("createProject").disabled = true;
    document.getElementById("goUser").disabled = true;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.browserAction.setIcon({
        path : "img/icons/recording.png",
        tabId: tabs[0].id
      });
    });
    setCounter();
    chrome.storage.local.set({ 'openedP': dProject });
  }

  function stopped() {
    document.getElementById("start").style.display = "inline-block";
    document.getElementById("pause").style.display = "none";
    document.getElementById("chartsBack").disabled = false;
    document.getElementById("createProject").disabled = false;
    document.getElementById("goUser").disabled = false;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.browserAction.setIcon({
        path : "img/icons/imgpsh_fullsize.png",
        tabId: tabs[0].id
      });
    });
    clearTimeout(timeoutId);
    chrome.storage.local.remove('openedP');
  }

//setting the messages to start recording the data
  startMeasuring = function() {
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

function setTimeString(time) {
    var parts = time.match(/(\d+):(\d+):(\d+)/);
    var time = new Date(0,0,0,parts[1], parts[2], parts[3]);
    var hours = (time.getHours() < 10) ? "0" + time.getHours().toString():time.getHours().toString();
    var minutes = (time.getMinutes() < 10) ? "0" + time.getMinutes().toString():time.getMinutes().toString();
    var seconds = (time.getSeconds() < 10) ? "0" + time.getSeconds().toString():time.getSeconds().toString();
    return hours + ":" + minutes + ":" + seconds + "h";  
}

function instance() {
    time += count;
    var elapsed = Math.floor(count/1000);
    projectTime.setSeconds(projectTime.getSeconds() + elapsed);
    dProject.time = setTimeString(projectTime.getHours().toString() + ":" + projectTime.getMinutes().toString() + ":" + projectTime.getSeconds().toString())
    var seconds = projectTime.getHours() * 3600 + projectTime.getMinutes() * 60 + projectTime.getSeconds();
    document.getElementById("projectTime").innerHTML = dProject.time;
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
