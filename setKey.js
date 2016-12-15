angular.module('metricsApp').controller('setKeysController', function($scope, $rootScope, $location, $state, $window) {

  document.getElementById("online_offline").innerHTML = "";
  login = function(e) {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    data = {user: {"email": email, "password": password}  }
    testLogin(data);
  }
  document.getElementById("login").addEventListener('click', login);
  
    var createXHTTP = function(callback) {
        var xhttp;
        if (window.XMLHttpRequest) {
           xhttp = new XMLHttpRequest();
        } else {
           xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.onreadystatechange = callback;
        return xhttp;
    };

//a few helper functions
    var testLogin = function(data) {
         var xhttp = createXHTTP( function(response) {
             if (xhttp.readyState == 4) {
                 if (xhttp.status == 200) {
                     getApiKey();
	           document.getElementById("message").innerHTML = "login succesful. Please reopen the extension.";
                 } else if (xhttp.status == 401) {
	           document.getElementById("message").innerHTML = "login invalid";
	      }
            }
        });
        xhttp.open('POST', 'http://metrics.authorship.me/users/login', true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Origin", window.top.location.href.split("?")[0]);
        xhttp.send(JSON.stringify( data ));
    };
    
    var getApiKey = function () {
      var xhttp = createXHTTP( function(response) {
             if (xhttp.readyState == 4) {
                 if (xhttp.status == 200) {
                     chrome.storage.local.set({ 'apikey': JSON.parse(xhttp.responseText).key });
                     }
            }
        });
        data = {login: document.getElementById("email").value, subscription: "3"}
        xhttp.open('POST', 'https://www.metrics.api.authorship.me/users/create', true);
        xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.setRequestHeader("Origin", window.top.location.href.split("?")[0]);
        xhttp.send(JSON.stringify( data ));
    }
    
});
