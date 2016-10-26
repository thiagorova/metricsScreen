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
  $scope.projectsList = [{'id': '1',
                          'projectName':'Birds and Nature',
                          'totalWords':'10000',
                          'milestone':{ 'deadline':'12/12/2012',
                                        'percentage':'10',
                                        'words':'100'}
                        },
                        { 'id': '2',
                          'projectName':'Getaway and Destinations',
                          'totalWords': 6000,
                          'milestone':{ 'deadline':'12/12/2012',
                                        'percentage':'20',
                                        'words':'900'}
                        }];

    //This is a watcher function, which changes the milestone parameter based on the select field
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
   $scope.validationMaster = true;
   $scope.validationPjName = function(){
        if($scope.project.projectName.length <= 0){
        $scope.pjNameShow = true;
        $scope.validationMaster = true;
      }
      else{
        $scope.pjNameShow = false;
        $scope.validationMaster = false;
      }
    }

    $scope.validationTotalWords = function(){
      if($scope.project.totalWords <= 0 || $scope.project.totalWords == null || $scope.project.totalWords.length <= 0 ){
        $scope.tWordsShow = true;
        $scope.validationMaster = true;
      }
      else{
        $scope.tWordsShow = false;
        $scope.validationMaster = false;
      }
    }

    $scope.validationMeasure = function(){
      if($scope.project.milestoneMeasure <= 0 ){
        $scope.measureShow = true;
        $scope.validationMaster = true;
      }
      else{
        $scope.measureShow = false;
        $scope.validationMaster = false;
      }
    }

    $scope.validationDate = function(){
      var d = new Date();
      if($scope.project.deadlineDate < d || $scope.project.deadlineDate == undefined){
        $scope.deadlineShow = true;
        $scope.validationMaster = true;
      }
      else{
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
        $scope.project = {};
        metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.words);
        $scope.showProjects();
        $scope.page = 1;


    };

    $scope.showProjects = function(){

      metrics.getAllProjects(null, function (projects) {
        //$scope.projectsList = projects;
        /*Quando conectar a API a variavel $scope.projectsList sera preenchida com
          a projects e esta ja está configurada para fazer um foreach na tabela
          usando ng-repeat
        */


      });

    }

    $scope.openProject = function(project){

      $scope.page = 3;
      lineGraph.clear();
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
