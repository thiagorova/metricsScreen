var language = 'en';
var pageName = location.href.split("/").slice(-1)[0].split(".").slice(-2)[0];
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
  language = localStorage.getItem('language');
  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType('text/xml');
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(this.responseText, "application/xml");
    translate(xmlDoc, language);
  }
};
  xhttp.open("GET", "xml/" + pageName + ".xml", true);
  xhttp.send();
}

function translate(xml){
  var idiom = xml.getElementsByTagName(language)[0];
  var i = 0;
  idiomLength = idiom.children.length;
  for(i=0; i< idiomLength; i++){
    var tag = idiom.children[i]
      if(tag){
        if(tag.getAttribute('type') ==='class'){
          $('.' + tag.tagName).text(tag.innerHTML);
        }
        else {
            $('#' + tag.tagName).text(tag.innerHTML);
        }
      }
    }
  }
