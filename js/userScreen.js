  var metricsApi;
  var data;


window.onload = function() {
  document.getElementById("back").addEventListener('click', goBack);
  document.getElementById("daily").addEventListener('click', function(e) {setChart("daily")} );
  document.getElementById("hourly").addEventListener('click', function(e) {setChart("hourly")});
  setSystem(function (metrics) {
     metricsApi = metrics;
     metricsApi.getUser( function(login) {
       document.getElementById("hello").innerHTML = "Ahoy " + login.split("@")[0];
     });
     metricsApi.getUserProductivity(function (metricsData) {
      if(metricsData !== "") {
        data = metricsData;
        document.getElementById("prodDay").innerHTML = getMostProductiveDay(metricsData);
        document.getElementById("prodHour").innerHTML = getMostProductiveHour(metricsData);
        setChart("daily");
      } else {
        document.getElementById("prodDay").innerHTML = 0;
        document.getElementById("prodHour").innerHTML = 0;
        buildGraph([]);
      }
    }, function (error) {
      document.getElementById("prodDay").innerHTML = 0;
      document.getElementById("prodHour").innerHTML = 0;
      buildGraph([]);
    });
  });
}

  function setChart(method) {
    var dailyButton = document.getElementById("daily");
    var hourlyButton = document.getElementById("hourly")
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
    return hourly;
  }
  
  function getDailyProduction(data) {
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
    var date = new Date(dateParts[0], parseInt(dateParts[1])-1, dateParts[2]).getDay()
    if (date === 1) return "Monday";
    else if (date === 2) return "Tuesday";
    else if (date === 3) return "Wednesday";
    else if (date === 4) return "Thursday";
    else if (date === 5) return "Friday";
    else if (date === 6) return "Saturday";
    else if (date === 0) return "Sunday";
  }

  function goBack() {
    changeLocation("projects.html");
  }
