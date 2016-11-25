var text=document.createElement("textarea");
text.style.display="none";
text.id="myReallyFakeTextArea";
var body=document.getElementsByTagName("body");
body[0].appendChild(text);
if(typeof window.tinyMCE !== "undefined") {
  var len=window.tinyMCE.editors.length;
  var editors=window.tinyMCE.editors;
  for(var i = 0; len > i; i++) {
    text.value += editors[i].getContent({format:"text"});
  }
} else { 
  text.value="";
}
