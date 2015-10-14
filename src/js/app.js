var app = angular.module('shuffling', []);

app.controller('FormController', ['$scope','Storage',function($scope, storageService) {
    $scope.submit = function() {
        var person = {
            "name":$scope.name,
            "date":$scope.transition_date,
            "transportation":$scope.transportation,
            "location":$scope.location
        };
        $scope.name = "";
        $scope.transition_date = "";
        $scope.transportation = "pickup";
        $scope.location = "";
        storageService.addPerson(person);
        $scope.$emit('tabChanged', 2);
    };
}]);

app.controller('TabController', ['$scope', function($scope) {
    $scope.$on('tabChanged', function(event, tab) {
        $scope.tab = tab
    });
}]);

app.factory('Storage', function() {
    var people = JSON.parse(sessionStorage.getItem('people')) || [];
    console.log(people);
    function addPerson(person) {
        people.push(person);
        console.log(people);
    }
    return {
        addPerson:addPerson
    };
});