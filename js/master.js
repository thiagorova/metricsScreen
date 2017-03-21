  var metrics;

  var updateOnlineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Online";
    checkStorage();
  }

  var updateOfflineStatus = function () {
    document.getElementById("online_offline").innerHTML = "Offline";
  }

  var goToAuthorship = function(e) {
    e.preventDefault();
    chrome.tabs.create({ url: "http://www.authorship.me"});
    return false;
  }

  var checkStorage = function() {
//all API calls in checkStorage are occuring inside timed intervals, to avoid throttling both chrome and the server with request. Since they are all asynchronous, its not a huge issue on the pages performance
    interval = 0;
    basePause = 5000; //5 seconds
    chrome.storage.local.get('newProjects', function(storedItem) {
      if(isEmpty(storedItem)  === false) {
        storedItem.newProjects.forEach(function(project)  {
          setTimeout(function () {
            metrics.createProject(project.projectName, project.totalWords, project.selectMilestone, project.milestoneMeasure);
            chrome.storage.local.remove('newProjects');
          }, interval);
          interval += basePause;
        });
      }
      chrome.storage.local.get(null, function(storedItem) {
        if(isEmpty(storedItem)  === false) {
          for (var property in storedItem) {
            if (storedItem.hasOwnProperty(property)) {
              if (property.match(/project\d+/)) {
                var id = parseInt(property.replace("project", ""));
                storedItem[property].data.forEach(function (metric) {
                  setTimeout(function () {
                    metrics.saveLater(metric.text, id, metric.time);
                  }, interval);
                  interval += basePause;
                });
               chrome.storage.local.remove(property);
              }
            }
          }
        }
      });
    });
  }

  var setSystem = function (callback) {
    window.addEventListener('online',  updateOnlineStatus);
    window.addEventListener('offline', updateOfflineStatus);
    document.getElementById("authorship-name").addEventListener('click', goToAuthorship);
    if (document.getElementById("goUser") !== null) document.getElementById("goUser").addEventListener('click', GoToUserScreen);
    if (document.getElementById("createProject") !== null) document.getElementById("createProject").addEventListener('click', function (e) {changeLocation("create.html");});

    var hrefParts = window.location.href.split("/");
    if(hrefParts[hrefParts.length - 1] === "empty.html") return;
    chrome.storage.local.get('apikey', function(storedItem) {
      if(isEmpty(storedItem)  === false && storedItem.apikey !== null) {
        metrics = new Metrics(storedItem.apikey);
        if (navigator.onLine === true) {
          updateOnlineStatus();
        } else {
          updateOfflineStatus();
        }
        if (hrefParts[hrefParts.length - 1] !== "project.html") {
          testOpenProject(metrics, callback);
        } else {
          if (callback !== null) callback(metrics);
        }
      } else {
        changeLocation("setKey.html");
      }
    });
  }

  function testOpenProject(metrics, callback) {
    chrome.storage.local.get('openedP', function(project) {
        if(!isEmpty(project)) {
          metrics.getProject(project.openedP.id, function(project) {
              GoToProject([project]);
            },
            function(error) {
              getFromStorage(project.openedP, function(project) {
                GoToProject([project]);
              });
            });
          } else {
              if (callback !== null) callback(metrics);
          }
      });
  }

function GoToProject(project, projectSet) {
  if (typeof projectSet === "undefined") {
    project = setProjects(project)[0];
  }
  if (project === "undefined") return;
  chrome.storage.local.set({ 'openedP': project.id });
  changeLocation("project.html");
}

function AlterProject(project){
  if(project === "undefined")
    return;
    chrome.storage.local.set({ 'projectAltering': project });
    chrome.storage.local.set({ 'isAltering': true });
    changeLocation("create.html");

}

function GoToUserScreen() {
   changeLocation("userScreen.html");
}

  var setProjects = function(projects) {
    var percentage;
    var len = projects.length;
    var pList = [];
    for (var i = 0; i < len; i ++) {
      if (projects[i] === null) continue;
      percentage = Math.round((projects[i].wordCount / projects[i].finish)*100)
      if (percentage > 100) percentage = 100;
      pList.push({
        'projectName':projects[i].name,
        'totalWords':projects[i].finish.toString(),
        'id': projects[i].id.toString(),
        'time': projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString()  + ":" + projects[i].time.seconds.toString(),
        'words':projects[i].wordCount.toString(),
        'creation': projects[i].creation,
        'completed' : projects[i].done,
        'lastUpdate' : projects[i].lastUpdate,
        'charCount': projects[i].charCount,
        'milestone':{
          'type': projects[i].milestoneType,
          'percentage': percentage.toString(),
          'words':(typeof projects[i].milestoneAverage === "undefined") ? null: projects[i].milestoneAverage.toString(),
          'deadline': (typeof projects[i].deadline === "undefined" || projects[i].deadline === null) ? null: projects[i].deadline.toString()
        }
      });
    }
    return pList;
  }

  function toDays(date){
    return (date/86400000);
  }

  function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}

  function changeLocation(local) {
    var hrefParts = window.location.href.split("/");
    if(hrefParts[hrefParts.length - 1] !== local) window.location.href = local;
  }

  if (window.onload === null) {
    window.onload = function () {
      setSystem(null);
    }
  }
