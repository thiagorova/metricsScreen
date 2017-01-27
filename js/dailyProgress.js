
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
    metricsData[i].date = new Date(year, parseInt(month -1), day, hour, minute, second, milisecond);
  }
}


function wordsPerHour(metricsData){
  formatDate(metricsData);
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


  while(i < metricsData.length){

    if (i + 1 < metricsData.length && metricsData[i].date.getDate() != metricsData[i+1].date.getDate()){
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

  writeTable(newData);
}

function writeTable(newData){
  var i= 0;
  for(i =0; i<newData.length; i++){
    $('#date-container').append('<p>' + newData[i].day + '</p>');
    $('#time-container').append('<p>' + newData[i].time + ' hours</p>');
    $('#words-container').append('<p>' + newData[i].words + '</p>');
  }
}

function daily_startSystem(metricsData) {			//all tabs should initiate from a method with a name like this "tab_startSystem". All will recieve metricsData, even if they dont need it....

}
