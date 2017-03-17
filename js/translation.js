var language = 'en';
var pageName = location.href.split("/").slice(-1)[0].split(".").slice(-2)[0];
var xmlPage;
globalTranslation = {};



$( document ).ready(function() {
  openXml(pageName);
  $( "#lEn" ).click(function() {
    chrome.storage.local.set({ 'language': "en" }, openAfterSaved(st));
  });
  $( "#lDe" ).click(function() {
    chrome.storage.local.set({ 'language': "de" }, openAfterSaved(st));
  });
  $( "#lPt" ).click(function() {
    chrome.storage.local.set({ 'language': "pt" }, openAfterSaved(st));
  });
});

function openAfterSaved(st) {
  openXml(pageName);
}

function openXml(pageName){
  var xhttp = new XMLHttpRequest();
  xhttp.overrideMimeType('text/xml');
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    chrome.storage.local.get('language', function(response) {
      if (isEmpty(response) {
        chrome.storage.local.set({ 'language': "en" });
        language = "en";
      } else {
        language = response.language;
      }
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xhttp.responseText, "application/xml");
      translate(xmlDoc, language);
      if (typeof resetDynamicText !== "undefined") resetDynamicText();
    }
  }
};
  xhttp.open("GET", "xml/" + pageName + ".xml", true);
  xhttp.send();
}

function translate(xml, language){
  var idiom = xml.getElementsByTagName(language)[0];
  if (typeof idiom === "undefined") return;
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
        }  else if (tag.getAttribute('type') ==='save'){
          globalTranslation[tag.getAttribute(value)] = tag.innerHTML;
          $('#' + tag.tagName).text(getWeekDay(localStorage.getItem('date')));
        } else {
            $('#' + tag.tagName).text(tag.innerHTML);
        }
      }
    }
  }
  
  function getWeekDay(date) {
    if (xmlPage === "undefined") return null;
    var length = xmlPage.children.length;
    for(i=0; i< length; i++) {
      var tag = xmlPage.children[i];
        if(tag) {
          if (tag.getAttribute('type') === 'multiDate') {
            return tag.children[date].innerHTML;
          }
        }
    }
  }
