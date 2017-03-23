
  var metricsApi;
  var project = {
    'projectName': null,
    'selectMilestone' : null,
    'totalWords': null,
    'milestoneMeasure': null,
    'deadline':null
    };
  var oldProject;

    //This is a watcher function, which changes the milestone parameter based on the select field
  var setMilestone = function(e) {
    var deadline = document.getElementById("deadlineDiv");
    var wordCount = document.getElementById("wordMilestoneDiv");
    project.selectMilestone = document.getElementById("selectMilestone").value;
    deadline.style.display = "none";
    wordCount.style.display = "block";
    if(project.selectMilestone == 'wDay'){
      document.getElementById("milestoneMeasureLabel").innerHTML = '<span id="milestoneDayLabel">How many words do you want to write per day</span>';
      openXml(pageName);
    } else if(project.selectMilestone == 'wMonth'){
      document.getElementById("milestoneMeasureLabel").innerHTML = '<span id="milestoneMonthLabel">How many words do you want to write per month</span>';
      openXml(pageName);
   } else if(project.selectMilestone == 'deadline'){
      deadline.style.display = "block";
      wordCount.style.display = "none";
    }
    enable();
  };

  dateValidation = function(e){
   var source = e.target || e.srcElement;
     var deadlineParts = source.value.split("-");
     var date = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
    if(date){
      var today = new Date();
      if(date < today || date.getDate() < 1 || date.getDate() > 31 || date.getMonth() < 0
          || date.getMonth() > 11){
        project.deadline = null;
        document.getElementById("deadlineError").style.display = "block";
        return false;
      }
      else {
        project.deadline = date;
        document.getElementById("deadlineError").style.display = "none";
        enable();
        return true;
      }
    }
  }

  var nameValidation = function(e){
   var source = e.target || e.srcElement;
   var name = source.value;
   console.log(name);
   if(name){
      if(name.length <=0){
        project.projectName = null;
        document.getElementById("nameError").style.display = "block";
        document.getElementById("create").disabled = true;
        return false;
      }
      else {
        project.projectName = name;
        console.log(name);
        document.getElementById("nameError").style.display = "none";
        document.getElementById("create").disabled = false;
        enable();
        return true;
      }
    }
    else
      document.getElementById("nameError").style.display = "block";
      document.getElementById("create").disabled = true;
  }
  var numberValidation = function(e){
   var source = e.target || e.srcElement;
    var number = source.value;
    console.log(number);
      if(number <= 0){
        if (source.id === "milestoneMeasure") {
          project.milestoneMeasure = null;
          //document.getElementById("milestoneError").style.display = "block";
        } else {
         project.totalWords = null;
         //document.getElementById("wordsError").style.display = "block";
       }

      }
      else {
        if (source.id === "milestoneMeasure") {
          project.milestoneMeasure = number;
          document.getElementById("milestoneError").style.display = "none";
        }  else {
          project.totalWords = number;
          document.getElementById("wordsError").style.display = "none";
        }
        enable();
        console.log(number);
      }
    }



  var enable = function(){
    var count = 0;
    for (var property in project) {
      if (project.hasOwnProperty(property)  && project[property] !== null) {
        count++;
      }
    }
    if (count === 4) {			//the form has 4 fields
      document.getElementById("create").disabled = false;
    }
  };



   //function to create a project
  var addProject = function(){
      console.log(project);
      var milestoneMeasure = (!project.milestoneMeasure) ? project.deadline:project.milestoneMeasure;
      metricsApi.createProject(project.projectName,
        project.totalWords,
        project.selectMilestone,
        milestoneMeasure,
        function () {
          metricsApi.getProjectId(project.projectName, function (projectId) {
            metrics.getProject(projectId, function(fetchedProject) {
              GoToProject([fetchedProject]);
            });
        });
        },
        function(error) {
          saveNewProject(project.projectName, project.totalWords, project.selectMilestone, milestoneMeasure);
          changeLocation("projects.html");
        });
  };

  var editProject = function(){

    console.log(project);
    console.log(oldProject);
    chrome.storage.local.set({ 'isAltering': false});
    var milestoneMeasure = (!project.milestoneMeasure) ? project.deadline:project.milestoneMeasure;
    var oldMilestoneMeasure = (!oldProject.milestone.type == "deadline") ?
      oldProject.milestone.deadline.split("/").reverse().join("-") :
      oldProject.milestoneMeasure;
    if ( (oldProject.projectName === project.projectName) &&
      (oldProject.totalWords === project.totalWords) &&
      (oldProject.milestone.type === project.selectMilestone) &&
      (oldMilestoneMeasure === milestoneMeasure) ) {
      GoToProject(oldProject, true);
    }
    metricsApi.UpdateProject(oldProject.id,
      (oldProject.projectName === project.projectName) ? null: project.projectName,
      (oldProject.totalWords === project.totalWords) ? null: project.totalWords,
      (oldProject.milestone.type === project.selectMilestone) ? null: project.selectMilestone,
      (oldMilestoneMeasure === milestoneMeasure) ? null: milestoneMeasure,
      (project.selectMilestone === "deadline"),
      function () {
          metrics.getProject(oldProject.id, function(fetchedProject) {
            GoToProject([fetchedProject]);
      });
      }
    );
  };

  var printWDays = function() {
    var totalWords = parseInt(document.getElementById("totalWords").value);
    if (! isNaN(totalWords)) {
     var wordsPerDay;
     var wordCount = parseInt(document.getElementById("milestoneMeasure").value);
     var deadlineParts = document.getElementById("deadline").value.split("-");
     var deadlineValue = new Date(deadlineParts[0], deadlineParts[1] - 1, deadlineParts[2]);
      if(project.selectMilestone === "wDay") {
        if(! isNaN(wordCount)) {
          wordsPerDay = (wordCount > totalWords ) ?
            Math.ceil(totalWords):
            Math.ceil(wordCount);
       }
      } else if (project.selectMilestone === "wMonth") {
        if(! isNaN(wordCount)) {
          wordsPerDay = (wordCount > totalWords ) ?
            Math.ceil(totalWords/30):
            Math.ceil(wordCount/30);
        }
      } else  if (project.selectMilestone === "deadline") {
        if(! isNaN(deadlineValue.getTime())) {
          var numDays = Math.ceil(toDays(deadlineValue - new Date()));
          if (numDays <= 0) numDays = 1;
          else numDays++;
          wordsPerDay = Math.ceil(totalWords / numDays);
        }
      }
      if(typeof wordsPerDay !== "undefined") {
        document.getElementById("output").innerHTML = "You need to write (approximately): " + wordsPerDay.toString() + " per day.";
      }
    }
  }

  function saveNewProject(projectName, totalWords, milestoneType, milestoneMeasure) {
    var newProject = {
      projectName:projectName,
      totalWords:totalWords,
      milestoneType: milestoneType,
      milestoneMeasure: milestoneMeasure
    };
    chrome.storage.local.get('projects', function(storedItem) {
      if (typeof storedItem.projects !== "undefined") {
        var statusArray = [createProjectStatus(newProject, storedItem.projects.length)]
        statusArray = statusArray.concat(storedItem.projects);
      } else {
        var statusArray = [createProjectStatus(newProject, 0)]
      }
      chrome.storage.local.set({ 'projects': statusArray });
    });
    chrome.storage.local.get('newProjects', function(storedItem) {
      var newProjects = [newProject];
      if (typeof storedItem.newProjects !== "undefined")
        newProjects = newProjects.concat(storedItem.newProjects);
        console.log(newProjects);
      chrome.storage.local.set({ 'newProjects': newProjects });
    });
  }

  function createProjectStatus(project, numProjects) {
    return {
      name: project.projectName,
      finish: project.totalWords,
      id: numProjects*11,
      time: {
        hours: 0,
        minutes: 0
      },
      wordCount: 0,
      creation: Date.now(),
      done: false,
      lastUpdate: Date.now(),
      milestoneType: project.milestoneType,
      milestoneAverage: (project.milestoneType !== "deadline") ? project.milestoneMeasure:null,
      deadline: (project.milestoneType === "deadline") ? null:project.milestoneMeasure
    };
  }

  function setAlterProject(fetchedProject){
    
    document.getElementById("create").disabled = false;
    oldProject = fetchedProject;
    document.getElementById("create").removeEventListener("click", addProject);
    document.getElementById("create").addEventListener("click", editProject);

    $('#projectName').val(fetchedProject.projectName);
    project.projectName = fetchedProject.projectName;

    $('#totalWords').val(fetchedProject.totalWords);
    project.totalWords = fetchedProject.totalWords;

    var milestone  = fetchedProject.milestone.type;
    if(milestone === 'wDay'){
      $('#selectMilestone').val($('#wDayLabel').val());
      setMilestone();
      $('#milestoneMeasure').val(fetchedProject.milestone.words);
      project.milestoneMeasure = fetchedProject.milestone.words;
    }
    else if (milestone ==='wMonth') {
      $('#selectMilestone').val($('#wMonthLabel').val());
        setMilestone();
      $('#milestoneMeasure').val(fetchedProject.milestone.words);
      project.milestoneMeasure = fetchedProject.milestone.words;
    }
    else{
      $('#selectMilestone').val($('#deadlineLabelOption').val());
        setMilestone();
      $('#deadline').val(fetchedProject.milestone.deadline.split("/").reverse().join("-"));
      project.deadline = fetchedProject.milestone.deadline.split("/").reverse().join("-");
    }
  }



window.onload = function () {

  document.getElementById("back").addEventListener('click', function(e){ changeLocation("projects.html");} );
  document.getElementById("create").addEventListener('click', addProject );
  document.getElementById("create").disabled = true;
  document.getElementById("projectName").addEventListener('blur', nameValidation );
  document.getElementById("projectName").addEventListener('change', nameValidation );
  var milestoneSelect = document.getElementById("selectMilestone");
  var totalWords = document.getElementById("totalWords");
  var milestoneMeasure = document.getElementById("milestoneMeasure");
  var deadline = document.getElementById("deadline");

  milestoneSelect.addEventListener('change', setMilestone );
  totalWords.addEventListener('keyup', numberValidation );
  milestoneMeasure.addEventListener('keyup', numberValidation );
  deadline.addEventListener('change', dateValidation );
  deadline.addEventListener('keyup', dateValidation );
  milestoneSelect.addEventListener('change', printWDays );
  totalWords.addEventListener('keyup', printWDays );
  milestoneMeasure.addEventListener('keyup', printWDays );
  deadline.addEventListener('change', printWDays );
  deadline.addEventListener('keyup', printWDays );
  setMilestone();
  setSystem(function(metrics) {
    metricsApi = metrics;
  });
  chrome.storage.local.get('isAltering', function(response){
    if(response.isAltering === true){
      chrome.storage.local.get('projectAltering', function(response){

        setAlterProject(response.projectAltering);
      });
    }
  });
}
