
function formatDate(metricsData) {

  var tempDate, date, splitedDate;
  var year, day, month, hour, minute, second, milisecond;
  /*
  14/12/16 10:46:03
  */

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
  console.log(metricsData);

  var j = 0;
  var i = 0;
  var contDif=0;
  var firstOfDay = metricsData[0].date;;
  var timeDif = new Array();
  var lastOfDay = null


  while(i < metricsData.length){

    if (i + 1 < metricsData.length && metricsData[i].date.getDate() != metricsData[i+1].date.getDate()){


      lastOfDay = metricsData[i].date;
      console.log('first: ' + firstOfDay);
      console.log('last: ' + lastOfDay);
      timeDif[contDif] = parseInt((lastOfDay - firstOfDay)) / 1000 / 3600
      contDif++;
      firstOfDay = metricsData[i+1].date;

    }
    else if(i + 1 == metricsData.length){
      lastOfDay = metricsData[i].date;
      console.log('first: ' + firstOfDay);
      console.log('last: ' + lastOfDay);

      timeDif[contDif] =  parseInt((lastOfDay - firstOfDay)) / 1000 / 3600;
      contDif++;
    }

    i++;
  }
  console.log(timeDif);
}

function daily_startSystem(metricsData) {			//all tabs should initiate from a method with a name like this "tab_startSystem". All will recieve metricsData, even if they dont need it....
	console.log(metricsData);
}
