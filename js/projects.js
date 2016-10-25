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
  $scope.period = 'day';
  $scope.page = 1;
  $scope.project = {'projectName':'',
                      'totalWords':'',
                      'milestone':{'percentage':'',
                                    'words':''}
                      };
  $scope.metricsList = [{'projectName':'Birds and Nature',
                          'totalWords':'10000',
                          'milestone':{'percentage':'10',
                                        'words':'100'}
                        },
                        {'projectName':'Getaway and Destinations',
                          'totalWords': 6000,
                          'milestone':{'percentage':'20',
                                        'words':'900'}
                        }];

    //This is a watcher function, which changes the milestone parameter based on the select field
    $scope.$watch('selectMilestone', function() {
       if($scope.selectMilestone == 'wDay')
        $scope.period = 'How many words do you want to write per day';
      else if($scope.selectMilestone == 'wMonth')
        $scope.period = 'How many words do you want to write per month';
      else
        $scope.period = 'For when is your project'

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
        $scope.metricsList.push($scope.project);
        $scope.project = {};
        metrics.createProject($scope.project.projectName, $scope.project.totalWords, $scope.selectMilestone, $scope.project.words);
        metrics.getAllProjects(function (projects) {
          //here is the callback where you fill the table
          alert(projects);
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

