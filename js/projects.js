/*var app = angular.module('pjApp',[])
app.controller('pjCtrl', function($scope, $http){
  $http.get('http://').
    then(function(response){
    metrics.milestone.percentage  //$scope.metrics = response.data;
    });


});*/
var app = angular.module('pjApp', ['ngAnimate']);
app.controller('pjCtrl', function($scope) {
  var list = [];
  var setStartPage = function(projects) {
    var len = projects.length;
    var newData = []
    for (var i = 0; i < len; i ++) {
      newData.push({
        'projectName':projects[i].name,
        'totalWords':projects[i].finish,
        'milestone':{
          'percentage': (projects[i].wordCount / projects[i].finish)*100,
          'words':projects[i].wordCount
        }
      });
    }
    $scope.metricsList += newData;
  }

  var metrics = new Metrics("eJwNyEEOg0AMA8AXUXmd2Mne+ApwQEhQ/n9r5zhMi2bNVhEtTIw5/tcKz4BTDsVCVacSMJlhZYURDcoKMYs1CrUc735v3/V8tuv+HO/zA8/zFm8=");
  var lineGraph = new LineGraph();
  $scope.project = {
    'projectName':'',
    'totalWords':'',
    'milestone': {
      'percentage':'',
      'words':''
    }
  };
  $scope.metricsList = [{
    'projectName':"hakase",
    'totalWords':"100",
    'milestone':{
      'percentage': "100%",
      'words':"100"
    }
  }, {
    'projectName':"japa",
    'totalWords':"200",
    'milestone': {
      'percentage': "10%",
      'words':"20"
    }
  }];
  $scope.page = 1;    
  metrics.getAllProjects(function (projects) {
 //here is the callback where you fill the table
   setStartPage (projects.projects);
  });  

  $scope.datepickerShow = 'false';
    //This is a watcher function, which changes the milestone parameter based on the select field
    $scope.period = 'For when is your project'
    $scope.$watch('selectMilestone', function() {
       if($scope.selectMilestone == 'wDay'){
           $scope.period = 'How many words do you want to write per day';
           $scope.datepickerShow = false;
       }
      else if($scope.selectMilestone == 'wMonth'){
        $scope.period = 'How many words do you want to write per month';
         $scope.datepickerShow = false;
       }
      else if($scope.selectMilestone == 'deadline'){
        $scope.period = 'For when is your project'
        $scope.datepickerShow = true;
      }

   });
   //page two Validation function
   $scope.validation = function(){

     return true;
   };

   //function to go to the create project page from anywhere
   $scope.createProject = function(){
     $scope.page = 2
   };

   //function to create a project
    $scope.addProject = function(){
      if ($scope.validation() == true){
        metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.milestoneMeasure);
        $scope.metricsList.push($scope.project);
        $scope.project = {};
        $scope.page = 1;
      }
    };

    $scope.openProject = function(){
      $scope.page = 3;
      lineGraph.clear()
      lineGraph.build(500, 250);
      lineGraph.setDateFormat("yearly_whole");
      metrics.getMetrics(function (metrics) {
        alert(metrics);
        lineGraph.setData(metrics);
      }, function(error) {
//        alert(error);
        lineGraph.setData();
      });
    }

/*
quando adicionar o leitor de textos, esse cara vai controlar tudo
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {please: "get tags"}, function(response) {
        if(typeof response === "undefined") {
        //  alert("No data available in this page");
        } else if  (response.error === "") {
          
        } else {
          alert(response.error);
        }      
    });
  });
  } else {
    chrome.tabs.create({url: "http://www.tags.authorship.me"});
  } 

*/

});
