metrics.controller('projectsController', function($scope, $rootScope, $location, $state, $window) {
  $scope.seeProjects = false;
  $scope.showProjects = function(){
    $rootScope.metrics.getAllProjects(viewProjects,
      function(error) {
        var projects = attemptStorage(viewProjects, 
          function(){
            $scope.$apply(function() {
              $location.path('/empty');
            });
        });
      });
    $scope.projectsListView = $scope.projectsList;
  };

  $scope.seeAllProjects = function() {
     $scope.projectsListView = $scope.projectsList;
  }

  function viewProjects(projects) {
    if (projects === "") {
         $scope.$apply(function() {
           $location.path('/empty');
       });
       return;         
    }
   saveProjects(projects);
    if ((typeof $rootScope.createdProject !== "undefined") && ($rootScope.createdProject === true) ) {
      GoToProject([projects[projects.length - 1]]);
      return;
    }
    $scope.seeProjects = true;
    var pList = setProjects(projects);
    if(pList.length >= 0) {
      $scope.$apply(function() {
        $scope.projectsList = pList;
        $scope.projectsListView = []
        var len = pList.length;
        for (i = 0; i < len; i ++) {
          if (pList[i].completed === "True" ) continue;
          if ( toDays(new Date() - pList[i].lastUpdate) >= 30  ) continue;
          $scope.projectsListView.push(pList[i]);
        }
          $scope.projectsListView.reverse();
      });
    }
  }

  //convert miliseconds to days
  function toDays(date){
    return (date/86400000);
  }


  //função para calcular a porcentagem cumulativa
  $scope.eloCalc = function(project){
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
    if(project.elo <= 0)
      return 'circle icon-ok';
  }

function attemptStorage(callback, callbackError) {
    chrome.storage.local.get("projects", function(storedItem) {
      if (angular.equals(storedItem, {})  === false) 
        callback(storedItem.projects);
      else callbackError()
    });
}

function saveProjects(projects) {
    chrome.storage.local.get('projects', function(storedItem) {
      if (angular.equals(storedItem, {})  === false)
        projects.concat(storedItem.projects);
        chrome.storage.local.set({ 'projects': projects });
    });
  }
  
    function GoToProject(project) {
    $scope.$apply(function() {
      var setProject = setProjects(project);
      $scope.sendProject(setProject[0]);
      $state.go('charts');
    });
  }
  
});
/*angular.module('metricsApp').component('projects', {
  bindings: { projects: '<' }
})*/

  var getFromStorage = function(projectId, callback) {
    chrome.storage.local.get('projects', function(storedItems) {
      storedItems.projects.forEach(function (project) {
        if (project.id == projectId) callback(project);
      });
    });
  }
  
  var setProjects = function(projects) {
    var percentage;
    var len = projects.length;
    var pList = [];
    for (var i = 0; i < len; i ++) {
      percentage = Math.round((projects[i].wordCount / projects[i].finish)*100)
      if (percentage > 100) percentage = 100;
      pList.push({
        'projectName':projects[i].name,
        'totalWords':projects[i].finish.toString(),
        'id': projects[i].id.toString(),
        'time': projects[i].time.hours.toString() + ":" + projects[i].time.minutes.toString()  + ":" + projects[i].time.seconds.toString(),
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
  
  
