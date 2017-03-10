
  var showProjects = function(metrics) {
    metrics.getAllProjects(viewProjects,
      function(error) {
        var projects = attemptStorage(viewProjects,
        function(){
          changeLocation("empty.html");
        });
      });
  };

  function viewProjects(projects) {
    if (projects === "") {
      changeLocation("empty.html");
      return;
    }
   saveProjects(projects);
    document.getElementById("loading").style.display = "none";
    document.getElementById("projects").style.display = "block";
   //setting up the projects as easy to work with objects, in the most appropirate display order
    var pList = setProjects(projects);
    if(pList.length >= 0) {
//      projectsList = pList;
      projectsListView = pList;
/*      var len = pList.length;
      for (i = 0; i < len; i ++) {
        if (pList[i].completed === "True" ) continue;
        if ( toDays(new Date() - pList[i].lastUpdate) >= 30  ) continue;
        projectsListView.push(pList[i]);
      }*/
      projectsListView.reverse();
      displayProjects(projectsListView);
    }
  }

  function displayProjects(projects) {		//here is where the projects actively appear on the page
    projects.forEach(function (project) {
      var line = document.createElement("TR");
      var pStatusTD = document.createElement("TD");
      var pStatusDiv = document.createElement("DIV");
      pStatusDiv.setAttribute("class", "projectStatus");
      pStatusDiv.setAttribute("class", projectStatus(project));
      pStatusTD.appendChild(pStatusDiv);
      line.appendChild(pStatusTD);

      var pNameTD = document.createElement("TD");
      var pNameButton = document.createElement("BUTTON");
      pNameButton.setAttribute("class", "btn-project-name");
      pNameButton.innerHTML = project.projectName;
      pNameButton.addEventListener("click", function(e) {GoToProject(project, true)});
      pNameTD.setAttribute("class", "td-project-name");
      pNameTD.appendChild(pNameButton);
      line.appendChild(pNameTD);

      var mPercentageTD = document.createElement("TD");
      var mPercentageP = document.createElement("P");
      var mPercentageSpan = document.createElement("SPAN");
      mPercentageSpan.innerHTML = "COMPLETE";
      mPercentageSpan.setAttribute("id", "completeLabel");
      mPercentageP.setAttribute("class", "milestonePercentage");
      mPercentageP.innerHTML = project.milestone.percentage;
      mPercentageTD.setAttribute("class", "info");
      mPercentageTD.appendChild(mPercentageSpan);
      mPercentageTD.appendChild(mPercentageP);
      line.appendChild(mPercentageTD);

      var pWordsTD = document.createElement("TD");
      var pWordsP = document.createElement("P");
      var pWordsSpan = document.createElement("SPAN");
      pWordsSpan.innerHTML = "WORDS";
      pWordsP.setAttribute("class", "projectWords");
      pWordsSpan.setAttribute("Id", "pWordsLabel");
      pWordsP.innerHTML = project.words;
      pWordsTD.setAttribute("class", "info");
      pWordsTD.appendChild(pWordsSpan);
      pWordsTD.appendChild(pWordsP);
      line.appendChild(pWordsTD);

      var mValueTD = document.createElement("TD");
      var mValueP = document.createElement("P");
      var mValueSpan = document.createElement("SPAN");
      mValueSpan.setAttribute("class", "milestoneText");
      mValueSpan.innerHTML = (project.milestone.type === "deadline") ? "<span id='deadlineLabel'>DEADLINE</span>" :  (project.milestone.type === "wDay") ? "<span id='dailyLabel'>DAILY</span>": "<span id='monthlyLabel'>MONTHLY</span>";
      mValueP.setAttribute("class", "milestoneValue");
      mValueP.innerHTML = project.milestone.words || project.milestone.deadline.replace("/20", "/");
      mValueTD.setAttribute("class", "info");
      mValueTD.appendChild(mValueSpan);
      mValueTD.appendChild(mValueP);
      line.appendChild(mValueTD);


      var exOtTD = document.createElement("TD");
      var exOtButton = document.createElement("BUTTON");
      var exOtImg = document.createElement("IMG");
      exOtImg.src = "img/menu-options.png";
      exOtButton.setAttribute("class", "moreOptions");
      exOtButton.addEventListener("click", function(e) { openOptions(project); });
      exOtTD.setAttribute("class", "info");
      exOtButton.appendChild(exOtImg);
      exOtTD.appendChild(exOtButton);
      line.appendChild(exOtTD);

      document.getElementsByTagName("table")[0].appendChild(line);

    });

  }

  function openOptions(project) {

  }

  //função para calcular a porcentagem cumulativa
  var eloCalc = function(project){
    if(project.completed === true) {
        project.elo =100;
        return;
      }
    var target;
    var today = new Date();
    var dateElements = project.creation.split("/")
    var creation = new Date(dateElements[2], parseInt(dateElements[1]) - 1, dateElements[0]);
    var difference = today - creation;
    if (project.milestone.type !== "deadline") {  //a project can either have an average or a deadline. if one is set, the other is null
      target = project.milestone.words * toDays(difference);
      if(project.milestone.type === "wMonth") {  //if it is a monthly milestone, then i must write about 1/30 of the daily expectation (per month)
         target /= 30;
      }
    } else {
      var deadlineElements = project.milestone.deadline.split("/")
      var deadline = new Date(deadlineElements[2], parseInt(deadlineElements[1]) - 1, deadlineElements[0]);
      target = project.totalWords/toDays(deadline - creation)
    }
    project.elo = (project.words * 100)/target;
  };

  //função para retornar as cores certas das bolinhas (definido pelas classes)
  var projectStatus = function(project) {
    if (typeof project.elo === "undefined") {
      eloCalc(project);
    }
    if(project.elo >= 99)
      return 'circle icon-success';
    if(project.elo >= 80 && project.elo < 99)
      return 'circle icon-attention';
    if(project.elo < 80 && project.elo > 0)
      return 'circle icon-danger';
    if(project.elo <= 0)
      return 'circle icon-ok';
  }

function attemptStorage(callback, callbackError) {
    chrome.storage.local.get("projects", function(storedItem) {
      if (isEmpty(storedItem)  === false)
        callback(storedItem.projects);
      else callbackError()
    });
}

function saveProjects(projects) {
    chrome.storage.local.get('projects', function(storedItem) {
      if (isEmpty(storedItem)  === false)
        projects.concat(storedItem.projects);
        chrome.storage.local.set({ 'projects': projects });
    });
  }

  var getFromStorage = function(projectId, callback) {
    chrome.storage.local.get('projects', function(storedItems) {
      storedItems.projects.forEach(function (project) {
        if (project.id == projectId) callback(project);
      });
    });
  }

window.onload = function() {
  setSystem(function(metrics) {showProjects(metrics);} );

}
