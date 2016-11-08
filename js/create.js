angular.module('metricsApp').controller('createController', function($scope, $location){
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
    $scope.metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure, function () {
      $scope.project = {};
      $location.path('/projects');    
    });

  };

  $scope.printWDays = function() {
    if (typeof $scope.project.totalWords !== "undefined") {
     var wordsPerDay = "unknown";
      if($scope.project.selectMilestone === "wDay") {
        if( typeof $scope.project.milestoneMeasure !=="undefined") {
          wordsPerDay = $scope.project.milestoneMeasure;
       }
      } else if ($scope.project.selectMilestone === "wMonth") {
        if( typeof $scope.project.milestoneMeasure !=="undefined") {
          wordsPerDay = Math.ceil($scope.project.milestoneMeasure/30);
        }
      } else  if ($scope.project.selectMilestone === "deadline") {
        if( typeof $scope.project.deadline !=="undefined") {
          var numDays = Math.ceil(toDays($scope.project.deadline - new Date()));
          if (numDays <= 0) numDays = 1;
          wordsPerDay = Math.ceil($scope.project.totalWords / numDays);
        }
      }
      document.getElementById("output").innerText = "You need to write (approximately): " + wordsPerDay.toString() + " per day.";
    }
  }

  function toDays(date){
    return (date/86400000);
  }

  $scope.$watch('project', function(){
    $scope.disable();
  }, true);

});
