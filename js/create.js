angular.module('metricsApp').controller('createController', function($scope){
  var metrics = new Metrics("eJwNyDsOgDAMBNETgTZre+10XAVSICQ+9++INHrFELAQmEF3V/OiuhhtPqUbyAT6wmpUWc7Qw8mqtGaQDBMVIoy2jO+493c7n/261/E9P8cBFlU=");

  $scope.period = 'For when is your project';
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
   //function to create a project
  $scope.addProject = function(){
    var milestoneMeasure = $scope.project.milestoneMeasure;
    if  (!milestoneMeasure) milestoneMeasure = $scope.project.deadline;
    metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure);
    $scope.project = {};
  };
});
