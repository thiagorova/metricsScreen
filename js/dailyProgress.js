var exportData;

function formatDate(metricsData) {

  var tempDate, date, splitedDate;
  var year, day, month, hour, minute, second, milisecond;

  for(var i = 0; i < metricsData.length; i++){
    date = metricsData[i].date;
    splitedDate = date.split('/')
    year = parseInt(splitedDate[2].substring(0,2)) + 2000;
    day = splitedDate[0];
    month = splitedDate[1];
    hour = splitedDate[2].substring(3,5);
    minute = splitedDate[2].substring(6,8);
    second = splitedDate[2].substring(9,11);
    milisecond = 00;
    metricsData[i].date = new Date(year, parseInt(month)-1, day, hour, minute, second, milisecond);
  }
}


function wordsPerHour(metricsData){
/*  formatDate(metricsData);
  //with some magic this function sorts the array by date
  metricsData = metricsData.sort(function(a,b){
    return a.date - b.date;
  });


  var i = 0;
  var contDif=0;
  var firstOfDay = metricsData[0].date;
  var newData = [];
  var temp = {};
  var lastOfDay = null
  var local = 'en-US';
  var options = { day: "numeric", year: "numeric", month: "long"};


  function dateIsDifferent(first, second) {
    return first.getDate() != second.getDate() ||first.getMonth() != second.getMonth() || first.getFullYear() != second.getFullYear();
  }

  while(i < metricsData.length){
    if (i + 1 < metricsData.length && dateIsDifferent(metricsData[i].date, metricsData[i+1].date) ){
      lastOfDay = metricsData[i].date;
      timeDif =  ((parseFloat((lastOfDay - firstOfDay))/ 1000 / 3600).toFixed(2));
      temp = {'day': firstOfDay.toLocaleString(local, options),'time':timeDif, 'words' : metricsData[i].count};
      newData.push(temp);
      firstOfDay = metricsData[i+1].date;
    }
    else if(i + 1 == metricsData.length){
      lastOfDay = metricsData[i].date;
      timeDif =  ((parseFloat((lastOfDay - firstOfDay))/ 1000 / 3600).toFixed(2));
      temp = {'day': firstOfDay.toLocaleString(local, options),'time':timeDif, 'words' : metricsData[i].count};
      newData.push(temp);
    }
    i++;
  }
  exportData = newData;
  writeTable(newData);
  */
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
      datum.maxTime = metricsData[i].date.split(" ")[1];
      datum.minTime = metricsData[i].date.split(" ")[1];
      datum.seconds = 0;
      datum.day = current;
      data.push(datum)
    } else if (datum.maxTime < metricsData[i].date.split(" ")[1]) {
        data[dataPos].count = metricsData[i].count;
        data[dataPos].maxTime = metricsData[i].date.split(" ")[1];
        data[dataPos].seconds = calculateSeconds(data[dataPos].maxTime, data[dataPos].minTime);
      } else if (datum.minTime > metricsData[i].date.split(" ")[1]) {
        datum.minTime = metricsData[i].date.split(" ")[1];
        data[dataPos].seconds = calculateSeconds(data[dataPos].maxTime, data[dataPos].minTime);
      }
    }
  exportData = data;
  writeTable(data);
}

function calculateSeconds(firstTime, secondTime) {
  var firstTimeParts = firstTime.split(":");
  var secondTimeParts = secondTime.split(":");
  var hours = parseInt(firstTimeParts[0]) - parseInt(secondTimeParts[0]);
  var minutes = parseInt(firstTimeParts[1]) - parseInt(secondTimeParts[1]);
  var seconds = parseInt(firstTimeParts[2]) - parseInt(secondTimeParts[2]);
  return hours*3600 + minutes*60 + seconds;
}

function writeTable(newData){
  var i= 0;
  for(i =0; i<newData.length; i++){
    $('#date-container').append('<p>' + newData[i].day + '</p>');
    $('#time-container').append('<p>' + Math.round(newData[i].seconds/36.0)/100.0 + ' h</p>');
    $('#words-container').append('<p>' + newData[i].count + '</p>');
  }
}
