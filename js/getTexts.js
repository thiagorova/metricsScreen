  var count = 10000;
  var intervalId = null;
  var projectId = null;
  var projectTime;
  var metrics;
  var heldProject;
  var start, timeoutId, projectTime;
  
  chrome.storage.local.get('apikey', function(storedItem) {
      metrics = new Metrics(storedItem.apikey);    
      chrome.storage.local.set({ 'apikey': storedItem.apikey });
  });
  
  var timeInterval = 0.1;  //number of minutes between readings. 0.2 is about 12 seconds
  var projectName;
  var heldData;
chrome.runtime.onMessage.addListener( function (request, sender, callback) {
  //main program, that will be executed every time a button is pressed
  if(request.request === "start") {
    startMeasuring();
    projectId = request.project;
    setCounter(request.time)
  } else if (request.request === "stop") {
    stopMeasuring();
    readText();
  } else if (request.request === "getId") {
    callback(projectId);
  } else if (request.request === "isMeasuring") {
    callback(intervalId !== null);
  } else if (request.request === "holdData") {
    heldData = request.project
    callback();
  } else if (request.request === "getData") {
    callback(heldData);
  }
  return true;
});

//methods inserted in the page!

function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

  function startMeasuring(){
    if(!intervalId) {
      intervalId = setInterval(readText, timeInterval * 60 * 1000);
      window.onunload=function() {
        return "are you sure you want to leave? The system will stop recording.";
      };
    }
  };

  function stopMeasuring() {
    if(intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      window.onunload=null;
    }
  };
    
  function readText() {  
    if(!document.getElementById('myReallyFakeTextArea')) {
      injectScript( chrome.extension.getURL('/js/catchData.js'), 'body');
    }
    
    var texts = document.getElementsByTagName('textarea');
    var contentEditable = document.querySelectorAll('[contenteditable=true]');
    var docAutomaticText = document.getElementsByClassName('kix-lineview-content');
    var Tlen = texts.length;
    var CElen = contentEditable.length;    
    var DATlen = docAutomaticText.length;
    var i;
    var data = "";

    if (DATlen == 0) {
      docAutomaticText = document.getElementsByClassName('doc-container');
      DATlen = docAutomaticText.length;
    }

    for(i=0; i < Tlen; i++) {
      data += (texts[i].value.trim() + "\n");
    } 

    for (i=0; i < CElen; i++) {
      data += (contentEditable[i].innerText.trim() + "\n");
    }

    for (i=0; i < DATlen; i++) {
      data += (docAutomaticText[i].innerText.trim() + "\n");
    }
//used only for wordpress
    sleep(800).then(() => {
      var createdTA = document.getElementById('myReallyFakeTextArea');
      data += createdTA.value.trim();
      data = data.trim();
      if (data !== "") {
        var message = data;
        metrics.analyze(data, projectId, function() { 
          sendStorage();
          projectId = (intervalId === null) ? null:projectId;
        }, function(error) { 
          saveToStorage(message);
          projectId = (intervalId === null) ? null:projectId;
        });
      } else if (intervalId === null) {
        projectId = null;
      }
    });
  }

  function setCounter(time) {
    projectTime = new Date();
    var parts = time.match(/(\d+):(\d+):(\d+)/);
    projectTime.setHours(parseInt(parts[1], 10));
    projectTime.setMinutes(parseInt(parts[2], 10));
    projectTime.setSeconds(parseInt(parts[3], 10)); 
    start = new Date().getTime();
    timeoutId = window.setTimeout(instance, count);
  }

function instance() {
    time += count;
    var elapsed = Math.floor(count/10000);
    totalTime.setSeconds(totalTime.getSeconds() + elapsed);
    var seconds = totalTime.getHours() * 3600 + totalTime.getMinutes() * 60 + totalTime.getSeconds();
    metricsApi.setDuration(projectId, seconds);
    metrics.setDuration = function (projectId, time, callback, callbackError) {
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


  function  saveToStorage(data) {
    var message = data;
    var fieldName = "project" + projectId.toString()
    json = {};
    json[fieldName] = {};
    json[fieldName].data = [toJSON(message)];
    chrome.storage.local.get(fieldName, function(storedItems) {
      if (typeof storedItems[fieldName] !== "undefined") 
        json[fieldName].data = json[fieldName].data.concat(storedItems[fieldName].data)
      chrome.storage.local.set(json);
    });
  }
  
  function sendStorage() {
    var fieldName = "project" + projectId.toString()
    chrome.storage.local.get(fieldName, function(storedItem) {
      if (isEmpty(storedItem)  === false) {
        storedItem[fieldName].data.forEach(function (metric) {
          metrics.saveLater(metric.text, projectId, metric.time);
          chrome.storage.local.remove(fieldName);
        });
      }
    });
  }

function isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return JSON.stringify(obj) === JSON.stringify({});
}
  
  
  var toJSON = function(text) {
  return {
      text: text,
      time: timenow()
    };
}

function timenow(){
    var now= new Date(), 
    h= now.getHours(), 
    m= now.getMinutes(),
    s= now.getSeconds(),
    day=now.getDate(),
    month=now.getMonth(),
    year=now.getFullYear()
    if(m < 10) m= '0' + m;
    if(s < 10) s= '0' + s;
    if (day < 10) day = '0' + day;
    return day + '/' + month + '/' + year + ' ' + h + ':' + m + ':' + s;
}
