$( document ).ready(function() {
  $( "#export" ).click(function() {
    if(dProject){
      console.log(dProject);
      var projectName = dProject.projectName;
      var doc = new jsPDF();
      doc.text(105, 20, 'Production of: ' + projectName, null, null, 'center');
      doc.text(20, 50, 'Date');
      doc.text(90, 50, 'Words');
      doc.text(170, 50, 'Hours');
      doc.save('Production - ' + projectName + '.pdf');
    }
    else {
      alert('undefined project');
    }
  });
});
