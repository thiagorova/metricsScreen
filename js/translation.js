$( document ).ready(function() {
  var language  = 'en';
  var pageName = location.href.split("/").slice(-1)[0].split(".").slice(-2)[0];
  var xml = '';

  $( "#lEn" ).click(function() {
    language = 'en';
  });
  $( "#lDe" ).click(function() {
    language = 'de';

  });
  $( "#lPt" ).click(function() {
    language = 'pt';
  });
  openXml(pageName);



  function openXml(pageName){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      this.xml = this.responseText;
      translate(this.xml, this.language);
    }
  };
  xhttp.open("GET", "xml/" + pageName + ".xml", true);
  xhttp.send();
  }

  function translate(xml, language){
    console.log(xml);
    console.log(language);
  }



});
