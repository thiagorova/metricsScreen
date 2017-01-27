

window.onload= function () {
  tabs = document.getElementsByClassName("tablink");  
  var len = tabs.length;
  for (var i = 0; i < len; i++) {
    tabs[i].addEventListener('click', function (e) {
      openTab(e, e.target.id.split("_")[0]);
    });
  }
  
  chart_startSystem();			//this does NOT only build the graph! it also does the work of getting the metrics. below, on openTab, we work on opening each projects startSystem!
  document.getElementById("chart_tab").click();
}


function openTab(evt, tabName) {
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
    if (tabName != "chart") {
       window[tabName + "_startSystem"](projectMetrics);				//dynamically calls method with name "tabName_startSystem". Now we should never mess with this file to create a tab!
    }
}
