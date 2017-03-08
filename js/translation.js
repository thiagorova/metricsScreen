$( document ).ready(function() {
  var language  = 'en';
  var pageName = location.href.split("/").slice(-1)[0].split(".").slice(-2)[0];


  $( "#lEn" ).click(function() {
    language = 'en';
    openXml(pageName, language);
  });
  $( "#lDe" ).click(function() {
    language = 'de';
    openXml(pageName, language);
  });
  $( "#lPt" ).click(function() {
    language = 'pt';
    openXml(pageName, language);
  });

  function openXml(pageName, language){
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

  function translate(xml, language){
    console.log(xml);
    var idiom = xml.getElementsByTagName(language)[0];
    var i = 0;
    idiomLength = idiom.children.length;

    for(i=0; i< idiomLength; i++){
      if(document.getElementById(idiom.children[i].tagName)){
      document.getElementById(idiom.children[i].tagName).innerHTML = idiom.children[i].innerHTML;
      console.log(idiom.children[i].innerHTML);
      }
    }
  }

});
