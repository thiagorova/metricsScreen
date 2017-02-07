chart = null;

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
    drawBarChart(dates, numWords);
  }

  var drawBarChart = function(dates, numWords) {
    var ctx = $("canvas");
    if (chart !== null) {
      chart.destroy();
    }
    chart = new Chart(ctx, {
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

  var drawLineChart = function(dates, numWords) {
    var ctx = $("canvas");
    if (chart !== null) {
      chart.destroy();
    }
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{
          label: '# of Words',
          data: numWords,
          fill: false,
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


