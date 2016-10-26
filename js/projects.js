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
  $scope.project = {  'projectId':'',
                      'projectName':'',
                      'totalWords':'',
                      'milestone':{ 'deadlineDate':'',
                                    'percentage':'',
                                    'words':''}
                      };
  $scope.projectsList = [{'projectId': '1',
                          'projectName':'Birds and Nature',
                          'totalWords':'10000',
                          'milestone':{ 'deadlineDate':'12/12/2012',
                                        'percentage':'10',
                                        'words':'100'}
                        },
                        { 'projectId': '1',
                          'projectName':'Getaway and Destinations',
                          'totalWords': 6000,
                          'milestone':{ 'deadlineDate':'12/12/2012',
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

        $scope.project = {};
        metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.words);
        metrics.getAllProjects(null, function (projects) {
          //$scope.projectsList = projects;
          /*Quando conectar a API a variavel $scope.projectsList sera preenchida com
            a projects e esta ja está configurada para fazer um foreach na tabela
            usando ng-repeat
          */
        });
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

});
