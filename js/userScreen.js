var metricsApi;
var data;
var weekdays = new Array(7);
var userLogin;
var activeChart;

window.onload = function() {
  document.getElementById("back").addEventListener('click', goBack);
  document.getElementById("daily").addEventListener('click', function(e) {setChart("daily")} );
  document.getElementById("hourly").addEventListener('click', function(e) {setChart("hourly")});
  setSystem(function (metrics) {
     metricsApi = metrics;
     metricsApi.getUser( function(login) {
       userLogin = login;
       document.getElementById("hello").innerHTML += login.split("@")[0];
     });
     metricsApi.getUserProductivity(function (metricsData) {
      if(metricsData !== "") {
        data = metricsData;
        document.getElementById("prodDay").innerHTML = getMostProductiveDay(metricsData);
        document.getElementById("prodHour").innerHTML = getMostProductiveHour(metricsData);
        setChart("daily");
      } else {
        document.getElementById("prodDay").innerHTML =  0;
        document.getElementById("prodHour").innerHTML = 0;
        buildGraph([]);
      }
    }, function (error) {
      document.getElementById("prodDay").innerHTML =  0;
      document.getElementById("prodHour").innerHTML = 0;
      buildGraph([]);
    });
  });
}

  function resetDynamicText () {
    weekdays = new Array(7);
    document.getElementById("prodDay").innerHTML = getMostProductiveDay(data);
    if (typeof userLogin !== "undefined") document.getElementById("hello").innerHTML += userLogin.split("@")[0];
    setChart(activeChart);
  }

  function setChart(method) {
    if (typeof data === "undefined") return;
    var dailyButton = document.getElementById("daily");
    var hourlyButton = document.getElementById("hourly")
    activeChart = method;
    if (method === "daily") {
      var chartData = getDailyProduction(data);
      dailyButton.setAttribute("class", "pressed");
      hourlyButton.className = hourlyButton.className.replace(/pressed/,'');
    } else {
      var chartData = getHourlyProduction(data);
      hourlyButton.setAttribute("class", "pressed");
      dailyButton.className = dailyButton.className.replace(/pressed/,'');
    }
    var words = Object.keys(chartData).map(function (key) { return chartData[key]; });
    var legend = Object.keys(chartData);
    drawLineChart(legend, words);
  }

  function getMostProductiveHour(metricsData) {
    var hourly = getHourlyProduction(metricsData);
    return Object.keys(hourly).reduce(function(a, b){ return hourly[a] > hourly[b] ? a : b });
  }

  function getMostProductiveDay(metricsData) {
    var daily = getDailyProduction(metricsData);
    if (isEmpty(daily)) return {};
    return Object.keys(daily).reduce(function(a, b){ return daily[a] > daily[b] ? a : b });
  }

  function getHourlyProduction(data) {
    var len = data.length;
    var hourly = {}
    for (var i = 0; i < len; i++) {
      var hour = data[i].time
      if (typeof hourly[hour] === "undefined" || hourly[hour] === null) {
        hourly[hour] = data[i].count;
      } else {
        hourly[hour] += data[i].count;
      }
    }
    var today = new Date();
    var timeZoneDiff = -today.getTimezoneOffset()/60;   //this method returns time difference in minuts
    if (timeZoneDiff >= 0) {
      var keyOrder = Object.keys(hourly);
    } else {
     var keyOrder = Object.keys(hourly).reverse()
    }
    keyOrder.map(function (hour) {
      hourly[hour - timeZoneDiff] = hourly[hour];
      delete hourly[hour];
    });
    return hourly;
  }

  function getDailyProduction(data) {
    if (typeof data === "undefined") return {};
    var len = data.length;
    var daily = {}
    for (var i = 0; i < len; i++) {
      var wDay = getWday(data[i]);
      if (typeof daily[wDay] === "undefined" || daily[wDay] === null) {
        daily[wDay] = data[i].count;
      } else {
        daily[wDay] += data[i].count;
      }
    }
    return daily;
  }

  function getWday(date) {
    var dateParts = date.date.split(" ")[0].split("-")
    var date = new Date(dateParts[0], parseInt(dateParts[1])-1, dateParts[2]).getDay();
    localStorage.setItem('date', date);
    if (typeof weekdays[date] === "undefined") {
      weekdays[date] = getWeekDay(date);
    }
    return weekdays[date];
  }

  function goBack() {
    changeLocation("projects.html");
  }
