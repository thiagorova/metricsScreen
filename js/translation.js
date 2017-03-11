var language = 'en';
var pageName = location.href.split("/").slice(-1)[0].split(".").slice(-2)[0];
var xmlPage;
$( document ).ready(function() {
  openXml(pageName);
  $( "#lEn" ).click(function() {
    localStorage.setItem('language','en');
    openXml(pageName);

  });
  $( "#lDe" ).click(function() {
    localStorage.setItem('language','de');
    openXml(pageName);
  });
  $( "#lPt" ).click(function() {
    localStorage.setItem('language','pt');
    openXml(pageName);
  });
});

function openXml(pageName){
  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType('text/xml');
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    language = localStorage.getItem('language');
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
    translate(xmlDoc, language);
    if (typeof resetDynamicText !== "undefined") resetDynamicText();
  }
};
  xhttp.open("GET", "xml/" + pageName + ".xml", true);
  xhttp.send();
}

function translate(xml){
  var idiom = xml.getElementsByTagName(language)[0];
  xmlPage = idiom;
  var i = 0;
  idiomLength = idiom.children.length;
  for(i=0; i< idiomLength; i++){
    var tag = idiom.children[i]
      if(tag){
        if (tag.getAttribute('type') ==='class'){
          $('.' + tag.tagName).text(tag.innerHTML);
        } else if (tag.getAttribute('type') ==='multiDate'){
          $('#' + tag.tagName).text(getWeekDay(localStorage.getItem('date')));
        }
        else {
            $('#' + tag.tagName).text(tag.innerHTML);
        }
      }
    }
  }
  
  function getWeekDay(date) {
    var length = xmlPage.children.length;
    if (xmlPage === "undefined") return null;
    for(i=0; i< length; i++) {
      var tag = xmlPage.children[i];
        if(tag) {
          if (tag.getAttribute('type') === 'multiDate') {
            return tag.children[date].innerHTML;
          }
        }
    }
  }
