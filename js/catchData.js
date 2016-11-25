var text=document.createElement("textarea");
text.style.display="none";
text.id="myReallyFakeTextArea";
var body=document.getElementsByTagName("body");
body[0].appendChild(text);
console.log(window.tinyMCE);
if(typeof window.tinyMCE !== "undefined") {
  var len=window.tinyMCE.editors.length;
  console.log(len);
  var editors=window.tinyMCE.editors;
  console.log(editors);
  for(var i = 0; len > i; i++) {
    text.value += editors[i].getContent({format:"text"});
      console.log(text.value);
  }
} else { 
  text.value="";
}
