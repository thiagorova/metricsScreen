;(function( window ) {

  'use strict';

var APIerror = null;

var Metrics = function (key) {
    this.text = "";
    this.priv = {}
    this.priv.key = key;
    this.priv.project = null;
    var mainAdd = "https://www.metrics.api.authorship.me/"
//    var mainAdd = "http://localhost:4000/";
    this.priv.metricsAdd = mainAdd + "metrics/";
    this.priv.userAdd = mainAdd + "users/";
    this.priv.projectAdd = mainAdd + "projects/";
  };

//public methods

    Metrics.prototype.createProject = function (projectName, acceptance, milestoneType, measure, callback, callbackError ) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callback = null; }
      var project = buildProjectJSON(this.priv.key, projectName, measure, acceptance, milestoneType);
      apiCall("POST", this.priv.projectAdd + "create", project, callback, callbackError);
    };

    Metrics.prototype.deleteProject = function (projectId, callback, callbackError ) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callback = null; }
        apiCall("DELETE", this.priv.projectAdd + "delete", buildJSON(this.priv.key, projectId), callback, callbackError);
    };

    Metrics.prototype.addDuration = function (projectId, time, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
        apiCall("PUT", this.priv.projectAdd + "update", buildUpdateJSON(this.priv.key, projectId, "duration", time), function(response) {
          if (response !== "") response = JSON.parse( response );
          if(callback !== null) callback();
        },
        callbackError);
    };

    Metrics.prototype.UpdateProject = function (projectId, name, totalWords, milestoneType, milestoneValue, isDeadline, callback, callbackError) {
      updateNames = [];
      updateValues = [];
      if (name !== null) { 
        updateNames.push("projectName");
        updateValues.push(name);
      }
      if (totalWords !== null) { 
        updateNames.push("totalWords");
        updateValues.push(totalWords);
      }
      if (milestoneType !== null) { 
        updateNames.push("milestoneType");
        updateValues.push(milestoneType);
      }
      if (milestoneValue == null) { 
        if (isDeadline) updateNames.push("deadline");
        else updateNames.push("milestoneCount");
        updateValues.push(milestoneValue);
      }
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      if (name !== null)
      apiCall("PUT", this.priv.projectAdd + "update", buildUpdateJSON(this.priv.key, projectId, "duration", time), function(response) {
          if (response !== "") response = JSON.parse( response );
          if(callback !== null) callback();
        },
        callbackError);
    };

//sends the text to the server to create
    Metrics.prototype.analyze = function (text, projectId, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
        apiCall("POST", this.priv.metricsAdd + "analyze", buildJSON(this.priv.key, projectId, text), function(response) {
          if (response !== "") response = JSON.parse( response );
          if(callback !== null) callback();
        },
        callbackError);
    };

    Metrics.prototype.saveLater = function (text, projectId, time, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      if (time[4] === "/") {
        var month = "0" + (parseInt(time[3]) + 1)
        time = [time.slice(0, 3), month, time.slice(4)].join('');
      } else {
        var month =  (parseInt(time.slice(3,5) ) + 1).toString()
        time = [time.slice(0, 3), month, time.slice(5)].join('');
      }
        apiCall("POST", this.priv.metricsAdd + "saveAsIs", buildJSON(this.priv.key, projectId, text, time), function(response) {
          if(callback !== null) callback(JSON.parse( response ));
        },
        callbackError);
    };

//returns project main Data: name, deadline and number of words necessary for the project to be completed
    Metrics.prototype.getProject = function (projectId, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.projectAdd + "show", buildJSON(this.priv.key, projectId), function(response) {
        if(callback !== null) callback(JSON.parse( response ).projects[0]);
      },
      callbackError);
    };

    Metrics.prototype.getProjectId = function (projectName, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.projectAdd + "getId", buildJSON(this.priv.key, projectName), function(response) {
        if(callback !== null) callback(JSON.parse( response ).id);
      },
      callbackError);
    };

    Metrics.prototype.getAllProjects = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.projectAdd + "index", buildJSON(this.priv.key), function(response) {
        var data = JSON.parse( response ).projects;
        if(callback !== null) callback(data);
      },
      callbackError);
    };

//returns a JSON with a list of milestones (number of words per datetime)
    Metrics.prototype.getMetrics = function (projectId, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.metricsAdd + "index", buildJSON(this.priv.key, projectId), function(response) {
        if(callback !== null) callback(JSON.parse( response ).metrics);
      },
      callbackError);
    };

    Metrics.prototype.getUser = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.userAdd + "show", {"apikey": this.priv.key }, function (response) {
        var user = JSON.parse( response );
        if (callback !== null) callback(user.login);
      }, callbackError);
    };

    Metrics.prototype.getUserProductivity = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
      apiCall("GET", this.priv.userAdd + "getProductivity", {"apikey": this.priv.key }, function (response) {
        var productivity = JSON.parse( response );
        if (callback !== null) callback(productivity.user_data);
      }, callbackError);
    };

    var createXHTTP = function(callback) {
        var xhttp;
        if (window.XMLHttpRequest) {
         xhttp = new XMLHttpRequest();
        } else {
                // code for IE6, IE5
        xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = callback;
        return xhttp;
    };

//a few helper functions
    var apiCall = function(method, api, data, callbackOK, callbackError) {
      if (typeof callbackOK === 'undefined') { callbackOK = null; }
      if (typeof callbackError === 'undefined') { callbackError = null; }
         var xhttp = createXHTTP( function(response) {
             if (xhttp.readyState == 4) {
                 if (xhttp.status == 200) {
                     if(callbackOK !== null) callbackOK(xhttp.responseText);
                } else {
                  if (xhttp.responseText !== "") {
                    try {
                      APIerror = JSON.parse(xhttp.responseText).error;
                    } catch(err) {
                      APIerror = "Something unexplained went wrong. Sorry.";
                    }
                  } else {
                    APIerror = "it seems that our API is, as of yet, completly unreachable. Please try again later";
                  }
                  if(callbackError !== null) callbackError(APIerror);
                }
            }
        });

        if (method === "GET") {
          var getParams = "";
          var next = false;
          for (var key in data) {
            if (data.hasOwnProperty(key)) {
              if (next) getParams += "&";
              getParams += key + "=" + encodeURI(data[key]);
              next = true;
            }
          }
          xhttp.open(method, api + "?" + getParams, true);
          xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else {
          xhttp.open(method, api, true);
          xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        }

        xhttp.setRequestHeader("Origin", window.top.location.href.split("?")[0]);
        //it is necessary to repeat the if because the request headers cannot be set before the xhttp.open()
        if (method === "GET")   xhttp.send();
        else xhttp.send(JSON.stringify( data ));
    };

var buildJSON = function(key, project, text, time) {
  if (typeof text === 'undefined') { text = null; }
  if (typeof time === 'undefined') { time = null; }
  return {
      apikey: key,
      text: text,
      project: project,
      time: time
    };
}

var buildUpdateJSON = function(key, projectId, toUpdateName, toUpdateData) {
   return {
      apikey: key,
      project: projectId,
      toUpdate: [{
        key: toUpdateName,
        value: toUpdateData
      }]
    };
}

var buildProjectJSON = function(key, projectName, milestoneMeasure, acceptance, milestoneTypes) {
  return {
      apikey: key,
      project: projectName,
      deadline: milestoneMeasure,
      numWords: acceptance,
      milestone: milestoneMeasure,
      milestoneType: milestoneTypes
    };
}

window.Metrics = Metrics;

})( window );
