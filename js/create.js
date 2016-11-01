angular.module('metricsApp').controller('createController', function($scope, $location){
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

  function dateValidation(date){
    today = new Date();
    if(date < today){
      return false;
    }
    else {
      return true;
    }
  }
  function nameValidation(name){
    if(name.length <=0){
      return false;
    }
    else {
      return true;
    }
  }
  function numberValidation(number){
    if(number <= 0){
      return false;
    }
    else {
      return true;
    }
  }
  $scope.disable = function(){
    switch ($scope.datepickerShow) {
      case true:
        if(dateValidation($scope.project.deadline) &&
            numberValidation($scope.project.totalWords)
          && nameValidation($scope.project.projectName)){
          return false;
        }
        else {
          return true;
        }
        break;
      case false:
        if(numberValidation($scope.project.totalWords) &&
         numberValidation($scope.project.milestoneMeasure)
          && nameValidation($scope.project.projectName)){
          return false;
        }
        else {
          return true;
        }
        break;
      default:
        if(dateValidation($scope.project.deadline) &&
            numberValidation($scope.project.totalWords)
          && nameValidation($scope.project.projectName)){
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
    metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, milestoneMeasure);
    $scope.project = {};
    $location.path('/projects');
  };
  
  $scope.$watch('project', function(){
    $scope.disable();
  }, true);

});
