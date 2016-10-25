
chrome.runtime.onMessage.addListener( function (request, sender, callback) {
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}

  var texts = document.getElementsByTagName('textarea');
  var contentEditable = document.querySelectorAll('[contenteditable=true]');
  var docAutomaticText = document.getElementsByClassName('kix-lineview-content');
  var Tlen = texts.length;
  var CElen = contentEditable.length;    
  var DATlen = docAutomaticText.length;
  var data = "";
  var i;
  injectScript( chrome.extension.getURL('/js/catchData.js'), 'body');

  if (DATlen == 0) {
    docAutomaticText = document.getElementsByClassName('doc-container');
    DATlen = docAutomaticText.length;
  }

  for(i=0; i < Tlen; i++) {
    data += (texts[i].value.trim() + "\n");
  }

  for (i=0; i < CElen; i++) {
    data += (contentEditable[i].innerText.trim() + "\n");
  }

  for (i=0; i < DATlen; i++) {
    data += (docAutomaticText[i].innerText.trim() + "\n");
  }
  
//used only for wordpress
  sleep(800).then(() => {
    var createdTA = document.getElementById('myReallyFakeTextArea');
    data += createdTA.value.trim();
    data = data.trim();
    createdTA.parentNode.removeChild(createdTA);
    if (data !== "") callback({"text": data, "error": ""});
    else callback({"error": "no text available.", "texts": ""});
  });
  return true;
});

