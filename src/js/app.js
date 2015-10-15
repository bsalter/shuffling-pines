(function() {
    var app = angular.module('shuffling', []);

    function TabController() {
        var vm = this;
        vm.tab = 1;
        vm.setTab = function(tabnum) {
            vm.tab = tabnum;
        };
        vm.checkTab = function(tabnum) {
            return vm.tab === tabnum;
        };
    }

    function FormController(storageService) {
        var vm = this;
        vm.transportation = 'pickup';
        vm.submit = function () {
            var patient_data = {
                "name": vm.name,
                "date": vm.transition_date,
                "transportation": vm.transportation,
                "location": vm.location
            };
            vm.name = "";
            vm.transition_date = "";
            vm.transportation = "pickup";
            vm.location = "";
            storageService.addPatient(patient_data);
        };
        vm.checkName = function(name) {
            return vm.name === name;
        };
        vm.checkDate = function(date) {
            return vm.transition_date === date;
        };
        vm.checkTransportation = function(transportation) {
            return vm.transportation === transportation;
        };
        vm.checkLocation = function(location) {
            return vm.location === location;
        }
    }

    function Storage() {
        var patients = JSON.parse(sessionStorage.getItem('patients')) || [];
        console.log(patients);
        function addPatient(patient) {
            patients.push(patient);
            console.log(patients);
        }

        return {
            addPatient: addPatient
        };
    }
    app.controller('FormController', ['Storage', FormController]);
    app.controller('TabController', [TabController]);
    app.factory('Storage', Storage);
})();