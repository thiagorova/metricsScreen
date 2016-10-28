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
    metrics.getAllProjects(function (projects) {

      var projects = projects.projects;
      var len = projects.length;
      var pList = [];
      var percentage;
      for (var i = 0; i < len; i ++) {
        percentage = Math.round((projects[i].wordCount / projects[i].finish)*100)
        if (percentage > 100) percentage = 100
        pList.push({
          'projectName':projects[i].name.toString(),
          'totalWords':projects[i].finish.toString(),
          'id': projects[i].id.toString(),
          'time':projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString(),
          'milestone':{
            'percentage': percentage.toString(),
            'words':projects[i].wordCount.toString(),
            'deadline': (typeof projects[i].deadline === "undefined") ? null: projects[i].deadline.toString()
          }
        });
      }
      $scope.$apply(function() {
        $scope.projectsList = pList;
      });
    });

  /*  $scope.projectsList = [{'projectName':'Birds and Nature',
                           'totalWords':'10000',
                           'id':'1',
                           'time' : '12:50',
                           'milestone':{'percentage':'10',
                                         'words':'100',
                                          'deadline':null}
                         },
                         {'projectName':'Birds and Nature',
                                                'totalWords':'10000',
                                                'id':'1',
                                                'time' : '12:50',
                                                'milestone':{'percentage':'10',
                                                              'words':'100',
                                                               'deadline':null}
                          }];
                          $scope.projectsList = [];*/

      if($scope.projectsList == '')
        $scope.page = 0;

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
    return 'circle icon-ok';
  };

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

  var getData = function() {

  };

});
