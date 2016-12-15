angular.module('metricsApp').controller('createController', function($scope, $rootScope, $location, $window, $state){
  $scope.period = 'For when is your project';
  $scope.datepickerShow = false;
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

  $scope.dateValidation = function(date){

    if(date){
      var today = new Date();
      if(date < today || date.getDate() < 1 || date.getDate() > 31 || date.getMonth() < 0
          || date.getMonth() > 11){
        return false;
      }
      else {
        return true;
      }
    }
  }
  $scope.nameValidation = function(name){
    if(name){
      if(name.length <=0){
        return false;
      }
      else {
        return true;
      }
    }
  }
  $scope.numberValidation = function(number){
    if(number){
      if(number <= 0){
        return false;
      }
      else {
        return true;
      }
    }
  }
  $scope.disable = function(){
    switch ($scope.datepickerShow) {
      case true:
        if($scope.dateValidation($scope.project.deadline) &&
            $scope.numberValidation($scope.project.totalWords)
          && $scope.nameValidation($scope.project.projectName)){
          return false;
        }
        else {
          return true;
        }
        break;
      case false:
        if($scope.numberValidation($scope.project.totalWords) &&
         $scope.numberValidation($scope.project.milestoneMeasure)
          && $scope.nameValidation($scope.project.projectName)){
          return false;
        }
        else {
          return true;
        }
        break;
      default:
        if($scope.dateValidation($scope.project.deadline) &&
            $scope.numberValidation($scope.project.totalWords)
          && $scope.nameValidation($scope.project.projectName)){
          return false;
        }
        else {
          return true;
        }
    }
  };
   //function to create a project
  $scope.addProject = function(){
    var milestoneMeasure = $scope.project.milestoneMeasure;
    if  (!milestoneMeasure) milestoneMeasure = $scope.project.deadline;
    $rootScope.metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure, finishCreation, 
    function(error) {
      saveNewProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure);
      finishCreation();
    });
  };

  function finishCreation() {
      $scope.$apply(function() {
        $scope.project = {};
       });
      $rootScope.$apply(function() {
        $rootScope.createdProject = true;
       });
      $state.go("projects");  
  }

  $scope.printWDays = function() {
    if ($scope.project.totalWords) {
     var wordsPerDay;
      if($scope.project.selectMilestone === "wDay") {
        if($scope.project.milestoneMeasure) {
          wordsPerDay = $scope.project.milestoneMeasure;
       }
      } else if ($scope.project.selectMilestone === "wMonth") {
        if($scope.project.milestoneMeasure) {
          wordsPerDay = Math.ceil($scope.project.milestoneMeasure/30);
        }
      } else  if ($scope.project.selectMilestone === "deadline") {
        if($scope.project.deadline) {
          var numDays = Math.ceil(toDays($scope.project.deadline - new Date()));
          if (numDays <= 0) numDays = 1;
          else numDays++;
          wordsPerDay = Math.ceil($scope.project.totalWords / numDays);
        }
      }
      if(typeof wordsPerDay !== "undefined") {
        $scope.output = "You need to write (approximately): " + wordsPerDay.toString() + " per day.";
      }
    }
  }

  function toDays(date){
    return (date/86400000);
  }

  $scope.$watch('project', function(){
    $scope.disable();
  }, true);


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
      console.log(statusArray);
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

});
