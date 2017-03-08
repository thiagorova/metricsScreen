$( document ).ready(function() {
  $( "#export" ).click(function() {
      var y = 70;
      var projectName = dProject.projectName;
      var doc = new jsPDF();
      doc.text(105, 20, projectName, null, null, 'center');
      doc.text(105, 35, document.getElementById("productionLabel").innerHTML, null, null, 'center');
      doc.text(20, 50, document.getElementById("dateLabel").innerHTML);
      doc.text(105, 50, document.getElementById("wordsLabel").innerHTML);
      doc.text(170, 50, document.getElementById("hoursLabel").innerHTML);
      var i;
      for(i = 0; i < exportData.length; i++){
        var time = Math.round(exportData[i].seconds/36.0)/100.0
        doc.text(20, y, exportData[i].day.toString());
        doc.text(110, y,''+ exportData[i].count.toString());
        doc.text(170, y, time.toString());
        y += 20;
      }
      //doc.save('Production.pdf');
      doc.save('Production-' + projectName + '.pdf');

  });
});
