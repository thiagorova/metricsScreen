var app = angular.module('pjApp', ['ngAnimate']);
app.controller('pjCtrl', function($scope) {
  var metrics = new Metrics("eJxFijkOgEAMxF4EmiSbYzq+QoEEBQJx/B+o6CzbkhWhYciISDjhBnWzlgSFns5K6xT1BjaWahHvE8Zm5oHPOkSqqXTjfc3bcc7LPvzYr9MDnkAaIw==");
  var lineGraph = new LineGraph();
  $scope.period = 'For when is your project';
  $scope.page = 1;
  $scope.datepickerShow = 'false';
  $scope.project = {
    'projectName':'',
    'selectMilestone' : '',
    'totalWords':'',
    'milestoneMeasure':'',
    'deadline':''
    };
  $scope.projectsList = [];

  //This is a watcher function, which changes the milestone parameter based on the select field
  $scope.$watch('project.selectMilestone', function() {
    if($scope.project.selectMilestone == 'wDay'){
      $scope.period = 'How many words do you want to write per day';
      $scope.datepickerShow = false;
    } else if($scope.project.selectMilestone == 'wMonth'){
      $scope.period = 'How many words do you want to write per month';
      $scope.datepickerShow = false;
   } else if($scope.project.selectMilestone == 'deadline'){
      $scope.period = 'For when is your project'
      $scope.datepickerShow = true;
    }
  });

  $scope.validationMaster = true;
  $scope.validationPjName = function(){
    if($scope.project.projectName.length <= 0) {
      $scope.pjNameShow = true;
      return true;
    } else{
      $scope.pjNameShow = false;
      return false;
    }
  }

  $scope.validationTotalWords = function(){
    if($scope.project.totalWords <= 0 || $scope.project.totalWords === null){
      $scope.tWordsShow = true;
      return true;
    } else{
      $scope.tWordsShow = false;
      return false;
    }
  }

  $scope.validationMeasure = function(){
    if($scope.project.selectMilestone === "deadline") return false;
    if($scope.project.milestoneMeasure <= 0 ){
      $scope.measureShow = true;
      return true;
    } else{
      $scope.measureShow = false;
      return false;
    }
  }

  $scope.validationDate = function(){
    if($scope.project.selectMilestone === "wMonth" || $scope.project.selectMilestone === "wDay") return false;
    return false;
  }
   
  $scope.validationMType = function(){
    if($scope.project.selectMilestone === "none")
      $scope.validationMaster = true;
    else
      $scope.validationMaster = false;
  }

  $scope.unifiedValidation = function(){
    if ($scope.validationPjName() ||
    $scope.validationTotalWords() ||
    $scope.validationMeasure() ||
    $scope.validationDate() ||
    $scope.validationMType()) {
       $scope.validationMaster = true;
    } else {
      $scope.validationMaster = false;
    }
  }



   //function to go to the create project page from anywhere
  $scope.createProject = function(){
    $scope.page = 2
   };

  $scope.toProjects = function(){
    $scope.page = 1
   };

   //function to create a project
  $scope.addProject = function(){
    var milestoneMeasure = $scope.project.milestoneMeasure;
    if  (!milestoneMeasure) milestoneMeasure = $scope.project.deadline;
    metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure, function () {
      $scope.project = {};
      $scope.showProjects();
      $scope.page = 1;
    });
  };

  $scope.showProjects = function(){
    metrics.getAllProjects(function (projects) {
      var pList = setProjects(projects);
      if(pList.length === 0) {
        $scope.$apply(function() {		//this is an XHR callback, so its not inside angular scope... therefore apply is necessary to bring it back
          $scope.page = 0;
        });
      } else {
        $scope.$apply(function() {
          $scope.projectsList = pList;
          $scope.projectsListView = []
          var len = pList.length;
          for (i = 0; i < len; i ++) {
            if (pList[i].completed === "True" ) continue;
            if ( toDays(new Date() - pList[i].lastUpdate) >= 30  ) continue;
            $scope.projectsListView.push(pList[i]);
          }
        });
      }
    }, function(error) {
      $scope.$apply(function() {
        $scope.page = 0;
      });
    });

  };

  $scope.seeAllProjects = function() {
     $scope.projectsListView = $scope.projectsList;
  }

  //convert miliseconds to days
  function toDays(date){
    return (date/86400000);
  }

  $scope.openProject = function(project){
    $scope.page = 3;
    $scope.dProject = project;
    metrics.getMetrics(project.id, function (metrics) {
      if(metrics !== "") {
       var graph = document.getElementById("graph");
       if (graph === null)  {
         graph = document.createElement("div");
         graph.id = "graph";
         document.getElementById("project-view").insertBefore(graph, document.getElementById("controls"));
       }
        lineGraph.clear();
        lineGraph.build(430, 240);
        lineGraph.setDateFormat("day_whole");
        lineGraph.setData(metrics);
      } else {
       var graph = document.getElementById("graph");
        graph.parentNode.removeChild(graph);
      }
    });
  };

//função para calcular a porcentagem cumulativa
  $scope.eloCalc = function(project){
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
  
//função para retornar as classes certas das bolinhas
  $scope.projectStatus = function(project){
    if (typeof project.elo === "undefined") {
      $scope.eloCalc(project)
    }
    if(project.elo >= 99)
      return 'circle icon-success';
    if(project.elo >= 80 && project.elo < 99)
      return 'circle icon-attention';
    if(project.elo < 80 && project.elo > 0)
      return 'circle icon-danger';
    if(project.elo == 0)
      return 'circle icon-ok';
  }

  $scope.startMeasuring = function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "start", project: $scope.dProject.id}, null);
    });
  };

  $scope.stopMeasuring = function(project) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {request: "stop", project: $scope.dProject.id}, null);
    });
  };

  function setProjects(projects) {
    var percentage;
    var len = projects.length;
    var pList = [];
    for (var i = 0; i < len; i ++) {
      percentage = Math.round((projects[i].wordCount / projects[i].finish)*100)
      if (percentage > 100) percentage = 100;
      pList.push({
        'projectName':projects[i].name.toString(),
        'totalWords':projects[i].finish.toString(),
        'id': projects[i].id.toString(),
        'time': projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString(),
        'words':projects[i].wordCount.toString(),
        'creation': projects[i].creation,
        'completed' : projects[i].done,
        'lastUpdate' : projects[i].lastUpdate,
        'milestone':{
          'type': projects[i].milestoneType,
          'percentage': percentage.toString(),
          'words':(typeof projects[i].milestoneAverage === "undefined") ? null: projects[i].milestoneAverage.toString(),
          'deadline': (typeof projects[i].deadline === "undefined") ? null: projects[i].deadline.toString()
        }
      });
    }
    return pList;
  }

});
