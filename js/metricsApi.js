;(function( window ) {

  'use strict';

var APIerror = null;

var Metrics = function (key) {
    this.text = "";
    this.priv = {}
    this.priv.key = key;
    this.priv.project = null;
    var mainAdd = "http://localhost:4000"
    this.priv.metricsAdd = mainAdd + "/metrics/";
    this.priv.userAdd = mainAdd + "/users/";
    this.priv.projectAdd = mainAdd + "/projects/";    
  };
   
//public methods
    Metrics.prototype.setProject = function (projectName) {
      this.project = projectName;
    };

    Metrics.prototype.createProject = function (projectName, acceptance, milestoneType, measure ) {
      this.project = projectName;
      var project = buildProjectJSON(this.priv.key, projectName, measure, acceptance, milestoneType);
      apiCall("POST", this.priv.projectAdd + "create", project);
    };

//sends the text to the server to create 
    Metrics.prototype.analyze = function (text, callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }      
      if (typeof callbackError === 'undefined') { callbackError = null; }      
      if (this.project !== null) {
        apiCall("POST", this.priv.metricsAdd + "analyze", buildJSON(this.priv.key, this.project, this.text), function(response) {
          if(callback !== null) callback(JSON.parse( response ));
        }, 
        callbackError);
      }
    };

//returns project main Data: name, deadline and number of words necessary for the project to be completed
    Metrics.prototype.getProject = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }      
      if (typeof callbackError === 'undefined') { callbackError = null; }      
      if (this.project !== null) {
        apiCall("GET", this.priv.projectAdd + "show", buildJSON(this.priv.key, this.project), function(response) {
          if(callback !== null) callback(JSON.parse( response ));
        }, 
        callbackError);
      }
    };

    Metrics.prototype.getAllProjects = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }      
      if (typeof callbackError === 'undefined') { callbackError = null; }      
      if (this.project !== null) {
        apiCall("GET", this.priv.projectAdd + "index", buildJSON(this.priv.key), function(response) {
          if(callback !== null) callback(JSON.parse( response ));
        }, 
        callbackError);
      }
    };

//returns a JSON with a list of milestones (number of words per datetime)
    Metrics.prototype.getMetrics = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }      
      if (typeof callbackError === 'undefined') { callbackError = null; }      
      if (this.project !== null) {
        apiCall("GET", this.priv.metricsAdd + "index", buildJSON(this.priv.key, this.project), function(response) {
          if(callback !== null) callback(JSON.parse( response ));
        }, 
        callbackError);
      }
    };

    Metrics.prototype.getUser = function (callback, callbackError) {
      if (typeof callback === 'undefined') { callback = null; }    
      if (typeof callbackError === 'undefined') { callbackError = null; }
        apiCall("GET", this.priv.userAdd + "show", {"apikey": this.priv.key }, function (response) {
          var user = JSON.parse( response );
           if (callback !== null) callback(user.login);
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
                    APIerror = JSON.parse(xhttp.responseText).error;
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

var buildJSON = function(key, project, text) {
  if (typeof text === 'undefined') { text = null; }  
  return {
      apikey: key,
      text: text,
      project: project
    };
}

var buildProjectJSON = function(key, projectName, deadlineDate, acceptance, milestoneTypes) {
  return {
      apikey: key,
      project: projectName,
      deadline: deadlineDate,
      numWords: acceptance,
      milestone: deadlineDate,
      milestoneType: milestoneTypes
    };
}

window.Metrics = Metrics;

})( window );

