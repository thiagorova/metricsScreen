$( document ).ready(function() {
  $( "#export" ).click(function() {
    if(dProject !== null){
      var y = 70;
      var projectName = dProject.projectName;
      var doc = new jsPDF();
      doc.text(105, 20, 'Production of: ' + projectName, null, null, 'center');
      doc.text(20, 50, 'Date');
      doc.text(105, 50, 'Words');
      doc.text(170, 50, 'Hours');
      var i;
      for(i = 0; i < exportData.length; i++){
        doc.text(20, y, exportData[i].day.toString());
        doc.text(110, y,''+ exportData[i].words.toString());
        doc.text(170, y, exportData[i].time.toString());
        y += 20;
      }
      doc.save('Production - ' + projectName + '.pdf');
    }
    else {
      alert('undefined project');
    }
  });
});
