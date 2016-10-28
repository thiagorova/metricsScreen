var app = angular.module('pjApp', ['ngAnimate']);
app.controller('pjCtrl', function($scope) {
  var metrics = new Metrics("eJwNyEEOg0AMA8AXUXmd2Mne+ApwQEhQ/n9r5zhMi2bNVhEtTIw5/tcKz4BTDsVCVacSMJlhZYURDcoKMYs1CrUc735v3/V8tuv+HO/zA8/zFm8=");
  var lineGraph = new LineGraph();
  $scope.period = 'For when is your project';
  $scope.page = 1;
  $scope.datepickerShow = 'false';
  $scope.project = {
    'projectName':'',
    'selectMilestone' : '',
    'totalWords':'',
    'milestoneMeasure':''
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
    metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.project.selectMilestone, $scope.project.milestoneMeasure);
    $scope.showProjects();
    $scope.project = {};
    $scope.showProjects();
    $scope.page = 1;
  };

  $scope.showProjects = function(){
      metrics.getAllProjects(function (projects) {
      var pList = setProjects(projects);

      if(pList.length === 0) {
        $scope.$apply(function() {
          $scope.page = 0;
        });
      } else {
        $scope.$apply(function() {
          $scope.projectsList = pList;
        });
      }
    }, function(error) {
        $scope.$apply(function() {
          $scope.page = 0;
        });
    });



  /*  $scope.projectsList = [{'projectName':'Birds and Nature',
                           'totalWords':'100',
                           'id':'1',
                           'time' : '12:50',
                           'creation' : '10/25/2016',
                           'milestoneMeasure' : '50',
                           'words' : '160', //esta variavel deve receber quantas palavras ja foram escritas até o momento
                           'elo' : '' //esta variavel é preenchida pela minha função e indica a porcentagem cumulativa
                         },
                         {'projectName':'Harry Potter',
                          'totalWords':'100',
                          'id':'2',
                          'time' : '12:50',
                          'creation' : '10/25/2016',
                          'milestoneMeasure' : '50',
                          'words' : '200',
                          'elo' : ''
                        },
                          {'projectName':'Hunger Games',
                           'totalWords':'100',
                           'id':'1',
                           'time' : '12:50',
                           'creation' : '10/27/2016',
                           'milestoneMeasure' : '200',
                           'words' : '1',
                           'elo' : ''
                           }];
                           */


  };
  //convert miliseconds to days
  function toDays(date){
    return (date/86400000);
  }

  $scope.openProject = function(project){
    $scope.page = 3;
    $scope.dProject = project;
    lineGraph.clear();
    lineGraph.build(430, 240);
    lineGraph.setDateFormat("day_whole");
    metrics.getMetrics(project.id, function (metrics) {
      if(metrics !== "") {
        lineGraph.setData(metrics);
      } else {
        $scope.dProject.time = "0";
      }
    }, function(error) {
      lineGraph.setData();
    });
  };

//função para calcular a porcentagem cumulativa
  $scope.eloCalc = function(){
    var today = new Date();
    var creation = '';
    var difference ='';
    var milestoneMeasure = '';
    var totalWords = '';
    var target = '';
    var words = '';
    var done = '';
    var elo ='';
    for(var i = 0; i < $scope.projectsList.length; i++){
      creation = new Date($scope.projectsList[i].creation);
      difference = today - creation; //quantos dias ja se passaram desde a criação do projeto
      milestoneMeasure = $scope.projectsList[i].milestoneMeasure;
      totalWords = $scope.projectsList[i].totalWords;
      target = milestoneMeasure * toDays(difference); //Quantas palavras eu ja deveria ter escrito até o dia de hoje
      words = $scope.projectsList[i].words;
      elo = (words * 100)/target;
      console.log('Eu comecei dia ' + creation + ' se passaram ' + toDays(difference) + ' dias, ' + ' tenho que escrever ' +
                    milestoneMeasure + ' palavras por dia, entao ja deveria ter escrito '+ target + ' palavras , porem só escrevi ' +
                    words + ' palavras! Minha performance é de: ' + elo + '%');

      $scope.projectsList[i].elo = elo;
    }
  };
//função para retornar as classes certas das bolinhas
  $scope.projectStatus = function(elo){
    if(elo >= 99)
      return 'circle icon-success';
    if(elo >= 80 && elo < 99)
      return 'circle icon-attention';
    if(elo < 80)
      return 'circle icon-danger';
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
        'milestone':{
          'percentage': percentage.toString(),
          'words':projects[i].wordCount.toString(),
          'deadline': (typeof projects[i].deadline === "undefined") ? projects[i].wordCount.toString(): projects[i].deadline.toString(),
        }
      });
    }
    return pList;
  }

});
