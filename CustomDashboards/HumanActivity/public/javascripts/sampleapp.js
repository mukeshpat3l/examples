//  Build our app module, with a dependency on the angular modal service.
//var Run = require('/clean_run');
var app = angular.module('falkonryApp', ['mgcrea.ngStrap']);
var key;
app.controller('HomeController', ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
    console.info('HomeController');
    $rootScope.key_passed = "";
    $scope.mykey = "";
    $scope.message   = null;
    $scope.error_show = 0;
    $scope.load_show = 0;
    $rootScope.pipelines = null;
    $rootScope.received = false;
    $rootScope.chosen_pipe = null;
    $rootScope.stay = 1;

    $scope.checkEntered = function () {
        if ($scope.mykey == "")
            return true;
        else
            return false;
    };

    $rootScope.getPipes = function () {
        $scope.load_show = 1;
        $scope.refresh_rate = 1;
        $scope.time_range = 2;
        $timeout(function () {
            $.ajax({
                url: 'http://localhost:3000/pipelist?api_key=' + $scope.mykey,
                contentType: 'application/json',
                async: false,
                success: function (response) {
                    $scope.error_show = 0;
                    $rootScope.pipelines = JSON.parse(response);
                    console.log($scope.pipelines.length);
                    $scope.message = $scope.pipelines[$scope.pipelines.length - 1].message;
                    $scope.load_show = 0;
                    if ($scope.message != "Success") {
                        $scope.error_show = 1;
                        $rootScope.received = false;
                    }
                    else {
                        $rootScope.received = true;
                        $rootScope.key_passed = $scope.mykey;
                        key = $scope.mykey;
                    }
                    $timeout(function () {
                        $scope.$apply();
                    });
                }
            });

        });
    };
}
]);

app.controller('PipeListController', ['$scope', '$rootScope', '$timeout', '$modal', function ($scope, $rootScope, $timeout, $modal) {
    $rootScope.leave = 0;
    $rootScope.stay = 1;
    var myModal = $modal({scope: $scope, template: './Modal/MyModal.tpl.html', show: false});

    $scope.startDeploy = function () {
        myModal.$promise.then(
            function () {
                $scope.deployModel = {
                    pipelineName: "",
                    selectedName: 0,
                    modal_message: null,
                    modal_error_show: 0,
                    modal_load_show: 0
                };
                myModal.show();
                $scope.checkValid = function () {
                    if (($scope.deployModel.selectedName != 1 && $scope.deployModel.selectedName != 2) || $scope.deployModel.pipelineName == "")
                        return true;
                    else
                        return false;
                };

                $scope.innerDeploy = function () {
                    if (key != null) {
                        myModal.hide();
                        $scope.deployModel.modal_load_show = 1;
                        $scope.deployModel.modal_message = "Setting up in Falkonry....";
                        $scope.deployModel.selectedName--;
                        $timeout(function () {
                            $.ajax({
                                url: 'http://localhost:3000/deploy?api_key=' + key + '&code=' + $scope.deployModel.selectedName + '&name=' + $scope.deployModel.pipelineName,
                                contentType: 'application/json',
                                async: false,
                                success: function (response) {
                                    console.log(response);
                                    $scope.deployModel.modal_load_show = 0;
                                    $rootScope.getPipes();
                                    $timeout(function () {
                                        $scope.$apply();
                                    });
                                }
                            });
                        })
                    }
                    else {
                        $scope.deployModel.modal_error_show = 1;
                        $scope.deployModel.modal_message = "Key is missing";
                    }
                };
            }
        );
    };

    $scope.startView = function (p) {
        $rootScope.chosen_pipe = p;
        $rootScope.leave = 1;
        $rootScope.stay = 0;
    };

    console.info('PipelineListController');
}]);

app.controller('PipelineDetailController', ['$scope', '$rootScope', function ($scope, $rootScope) {
    console.info('PipelineDetailController');

    $.ajax({
        url: 'http://localhost:3000/output?api_key=' + key + '&P_id=' + $rootScope.chosen_pipe.id,
        contentType: 'application/json',
        async: false,
        statusCode: {
            400: function (res) {
                alert(JSON.parse(res.responseText).message);
                $rootScope.leave = 0;
                $rootScope.stay = 1;
            },
            200: function (res) {
                google.charts.load('current', {'packages': ['timeline']});
                google.charts.setOnLoadCallback(drawChart);
                function drawChart() {
                    var container = document.getElementById('timeline');
                    var chart = new google.visualization.Timeline(container);
                    var dataTable = new google.visualization.DataTable();

                    dataTable.addColumn({type: 'string', id: 'Group'});
                    dataTable.addColumn({type: 'string', id: 'President'});
                    dataTable.addColumn({type:  'date', id: 'Start'});
                     dataTable.addColumn({type: 'date', id: 'End'});
                    var c = res.split("\n");
                    c.splice(-1,1);
                    for (var i = 1; i <c.length-1; i++) {
                        console.log(i);
                        var arr1 = c[i].split(',');
                        var arr2 = c[i+1].split(',');
                        while(arr2[2]==arr1[2] && i<c.length-2) {
                            i++;
                            arr2 = c[i+1].split(',');
                        }
                        D1 = new Date(parseInt(arr1[0]));
                        D2 = new Date(parseInt(arr2[0]));
                        dataTable.addRow([arr1[1],arr1[2], D1, D2]);
                    }

                    chart.draw(dataTable);
                }
            }
        }
    });
    $scope.goBack = function () {
            $rootScope.leave = 0;
        $rootScope.stay = 1;
        $rootScope.chosen_pipe = null;
    };
}]);
