

function buildTabs(firstTab) {
  tabs = document.getElementsByClassName("tablink");  
  var len = tabs.length;
  for (var i = 0; i < len; i++) {
    tabs[i].addEventListener('click', function (e) {
      openTab(e, e.target.id.split("_")[0]);
    });
  }
  start = document.getElementById(firstTab);
  if (start !== null) {
    start.click();
  }
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
}
