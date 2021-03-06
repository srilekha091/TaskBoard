﻿/// <reference path="angular.js" />
/// <reference path="angular-route.js" />
/// <reference path="ui-bootstrap.js" />

var app = angular.module("TaskBoardApp", ["ngRoute", 'ui.bootstrap', 'ngDragDrop'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "Templates/TaskManagement.html",
                controller: "getallprojectsController"
            })
            .when("/ProjectPage/:id", {
                templateUrl: "Templates/ProjectPage.html",
                controller: "getprojectDetailsController"
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .controller("getallprojectsController", function ($scope, $http) {
        $http.get("TaskManagerService.asmx/GetAllProjects")
            .then(function (response) {
                $scope.projects = response.data;
            })
    })
    .controller("getprojectDetailsController", function ($scope, $http, $routeParams) {
        $http({
            url: "TaskManagerService.asmx/GetProject",
            params: { projectId: $routeParams.id },
            method: "get"
        })
            .then(function (response) {
                $scope.ProjectDetails = response.data;
        })

    })
    .controller("dragDropController", function ($scope, $http, $routeParams, $route) {
        
        $scope.dragCallback = function (event, ui, taskId) {
            console.log(taskId);
            $scope.TaskBeingDragged = parseInt(taskId.taskId);
        };

        $scope.dropCallback = function (event, ui, employeeId) {
            if (employeeId.employeeId == 0)
            {
                return;
            }

            $scope.DraggedToEmployee = parseInt(employeeId.employeeId);
            
            $http({
                url: "TaskManagerService.asmx/UpdateTasksTable",
                data: { employeeId: $scope.DraggedToEmployee, taskId: $scope.TaskBeingDragged },
                method: "post"
            })
            .then(function (response) {
                console.log("Successfully updated the Task table");
                $route.reload();
            })
        };

    })
    /* Controller for pop up modal form for adding new project*/
    .controller("modalAccountFormController", function ($scope, $modal, $log, $route) {

            $scope.showForm = function () {

                var modalInstance = $modal.open({
                    templateUrl: 'Templates/CreateProject.html',
                    controller: ModalInstanceCtrl,
                    scope: $scope,
                    resolve: {
                        userForm: function () {
                            return $scope.userForm;
                        }
                    }
                });

                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                }, function () {
                    $log.info('Modal dismissed');
                    });
            };
    })

    /* end of add new project controller */

    /* Controller for pop up modal form for adding new member*/
    .controller("addNewMemberFormController", function ($scope, $modal, $log, $route) {

        $scope.showForm = function () {

            var addNewMemberInstance = $modal.open({
                templateUrl: 'Templates/AddNewMember.html',
                controller: AddNewMemberInstanceCtrl,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

            addNewMemberInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed');
            });
        };
    });

    /* end of add new member controller */

        var ModalInstanceCtrl = function ($route, $scope, $modalInstance, userForm) {
            $scope.form = {}
            $scope.submitForm = function () {
                if ($scope.form.userForm.$valid) {

                    var newProjectData = {
                        ProjectName: $scope.form.userForm.Title.$modelValue,
                        ProjectDescription: $scope.form.userForm.Description.$modelValue,
                        EmployeesWorkingOnProject: []
                    };


                    var jsonData = JSON.stringify(newProjectData);

                    $.ajax({
                        url: "TaskManagerService.asmx/AddNewProject",
                        method: "post",
                        data: '{project : ' + jsonData + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    })
                        .then(function (response) {
                            console.log("Successfully added new project");
                            $route.reload();
                        }, function (response) {
                            console.log("Failed to add new project");
                        })

                    $modalInstance.close('closed');
                } else {
                    console.log('userform is not in scope');
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };

    var AddNewMemberInstanceCtrl = function ($route, $scope, $addNewMemberInstance, userForm) {
            $scope.form = {}
            $scope.submitForm = function () {
                if ($scope.form.userForm.$valid) {

                    var newEmployeeData = {
                        EmployeeName: $scope.form.userForm.EmployeeName.$modelValue
                    };


                    var jsonData = JSON.stringify(newEmployeeData);

                    $.ajax({
                        url: "TaskManagerService.asmx/AddNewEmployee",
                        method: "post",
                        data: '{employee : ' + jsonData + '}',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json"
                    })
                        .then(function (response) {
                            console.log("Successfully added new employee");
                            $route.reload();
                        }, function (response) {
                            console.log("Failed to add new employee");
                        })

                    $modalInstance.close('closed');
                } else {
                    console.log('userform is not in scope');
                }
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        };


function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}