/*var app = angular.module('pjApp',[])
app.controller('pjCtrl', function($scope, $http){
  $http.get('http://').
  then(function(response){
  metrics.milestone.percentage  //$scope.metrics = response.data;
  });


});*/

var app = angular.module('pjApp', ['ngAnimate']);
app.controller('pjCtrl', function($scope) {
  var metrics = new Metrics("eJwNyEEOg0AMA8AXUXmd2Mne+ApwQEhQ/n9r5zhMi2bNVhEtTIw5/tcKz4BTDsVCVacSMJlhZYURDcoKMYs1CrUc735v3/V8tuv+HO/zA8/zFm8=");
  var lineGraph = new LineGraph();
  $scope.period = 'For when is your project';
  $scope.page = 1;
  $scope.datepickerShow = 'false';
  $scope.project = {  'id':'',
    'projectName':'',
    'totalWords':'',
    'milestone':{ 'deadline':'',
      'percentage':'',
      'words':''}
    };
  $scope.projectsList = [];

  //This is a watcher function, which changes the milestone parameter based on the select field
  $scope.$watch('selectMilestone', function() {
    if($scope.selectMilestone == 'wDay'){
      $scope.period = 'How many words do you want to write per day';
      $scope.datepickerShow = false;
    } else if($scope.selectMilestone == 'wMonth'){
      $scope.period = 'How many words do you want to write per month';
      $scope.datepickerShow = false;
   } else if($scope.selectMilestone == 'deadline'){
      $scope.period = 'For when is your project'
      $scope.datepickerShow = true;
    }
  });

  $scope.validationMaster = true;
  $scope.validationPjName = function(){
    if($scope.project.projectName.length <= 0) {
      $scope.pjNameShow = true;
      $scope.validationMaster = true;
    } else{
      $scope.pjNameShow = false;
      $scope.validationMaster = false;
    }
  }

  $scope.validationTotalWords = function(){
    if($scope.project.totalWords <= 0 || $scope.project.totalWords == null || $scope.project.totalWords.length <= 0 ){
      $scope.tWordsShow = true;
      $scope.validationMaster = true;
    } else{
      $scope.tWordsShow = false;
      $scope.validationMaster = false;
    }
  }

  $scope.validationMeasure = function(){
    if($scope.project.milestoneMeasure <= 0 ){
      $scope.measureShow = true;
      $scope.validationMaster = true;
    } else{
      $scope.measureShow = false;
      $scope.validationMaster = false;
    }
  }

  $scope.validationDate = function(){
    var d = new Date();
    if($scope.project.deadlineDate < d || $scope.project.deadlineDate == undefined){
      $scope.deadlineShow = true;
      $scope.validationMaster = true;
    } else{
      $scope.deadlineShow = false;
      $scope.validationMaster = false;
    }
  }

  $scope.unifiedValidation = function(){
    $scope.validationPjName();
    $scope.validationTotalWords();
    $scope.validationMeasure();
    $scope.validationDate();
  }



   //function to go to the create project page from anywhere
  $scope.createProject = function(){
    $scope.page = 2
   };

   //function to create a project
  $scope.addProject = function(){
    $scope.unifiedValidation();
    metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.words);
    $scope.showProjects();
    $scope.project = {};
    $scope.showProjects();
    $scope.page = 1;
  };

  $scope.showProjects = function(){

    /*metrics.getAllProjects(function (projects) {
      var projects = projects.projects;
      var len = projects.length;
      var pList = [];
      for (var i = 0; i < len; i ++) {
        pList.push({
          'projectName':projects[i].name.toString(),
          'totalWords':projects[i].finish.toString()',
          'id': projects[i].id.toString(),
          'time':projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString(),
          'milestone':{
            'percentage':((projects[i].wordCount / projects[i].finish)*100).toString(),
            'words':projects[i].wordCount.toString(),
            'deadline':(typeof projects[i].deadline === "undefined") ? null: projects[i].deadline.toString()
          }
        });
      }
      $scope.$apply(function() {

        $scope.projectsList = pList;
      });
    });
    */
      $scope.projectsList =[{
      'projectName':'Harry Potter',//projects[i].name.toString(),
      'totalWords':'10000',//projects[i].finish.toString(),
      'id': '1',//projects[i].id.toString(),
      'time':'12:50',//projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString(),
      'milestone':{
        'percentage':'50', //((projects[i].wordCount / projects[i].finish)*100).toString(),
        'words':'5000',//projects[i].wordCount.toString(),
        'deadline':'12/12/2016' //(typeof projects[i].deadline === "undefined") ? null: projects[i].deadline.toString()
      }
    },
    {
    'projectName':'Hunger Games',//projects[i].name.toString(),
    'totalWords':'15000',//projects[i].finish.toString(),
    'id': '2',//projects[i].id.toString(),
    'time':'13:50',//projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString(),
    'milestone':{
      'percentage':'75', //((projects[i].wordCount / projects[i].finish)*100).toString(),
      'words':'10000',//projects[i].wordCount.toString(),
      'deadline':null //(typeof projects[i].deadline === "undefined") ? null: projects[i].deadline.toString()
    }
  }];
  }

  $scope.openProject = function(project){
    $scope.page = 3;
    $scope.dProject = project;
    lineGraph.clear();
    lineGraph.build(500, 250);
    lineGraph.setDateFormat("day_whole");
    metrics.getMetrics(project.id, function (metrics) {
    if(metrics.metrics !== "") {
      lineGraph.setData(metrics.metrics);
    } else
      $scope.dProject.time = "0";
    }, function(error) {
      lineGraph.setData();
    });
  };

  $scope.projectStatus = function(){

  };


  $scope.startMeasuring = function(){
    var timeInterval = 2; //number of minutes between readings
    if(!$scope.intervalId) {
    dProject.
      $scope.intervalId = setInterval(function() {getData($scope.dProject.id); }, timeInterval * 60 * 1000);
    }
  };


  $scope.stopMeasuring = function(project) {
    if($scope.intervalId) {
      clearInterval($scope.intervalId);
      $scope.intervalId = null;
    }
  };

  var getData = function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {please: "get tags"}, function(response) {
        if(typeof response === "undefined") {
          alert("No data available in this page");
        } else if  (response.error === "") {
          metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.words);
        } else {
          alert(response.error);
        }
      });
    });
  };

});
