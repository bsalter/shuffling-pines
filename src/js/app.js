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
        vm.transportation = 'pick up';
        vm.submit = function () {
            var patient_data = {
                "name": vm.name,
                "date": vm.transition_date,
                "transportation": vm.transportation,
                "location": vm.location || ""
            };
            vm.name = "";
            vm.transition_date = "";
            vm.transportation = "pick up";
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

    function PatientListController(storageService) {
        var vm = this;
        vm.getPatients = function() {
            return storageService.getPatients();
        };
        vm.checkLocation = function(location) {
            return (location !== "");
        };
        vm.getOptions = function(current_transportation) {
            if(current_transportation == "pick up" || current_transportation == "drop off") {
                return [current_transportation,"arrived"];
            } else {
                return ["arrived","pick up"];
            }
        }
    }

    function Storage() {
        this.patients = JSON.parse(localStorage.getItem('patients')) || [];
        console.log(this.patients);
        this.addPatient = function(patient) {
            this.patients.push(patient);
            localStorage.setItem('patients',angular.toJson(this.patients));
            // make sure we stored it correctly
            this.patients = JSON.parse(localStorage.getItem('patients'));
            console.log(this.patients);
        };
        this.getPatients = function() {
            return this.patients;
        };
        if(this.patients.length == 0) { // initialize with example data
            console.log("Begin initialization");
            var data = {
                "name":"Frank",
                "date":"02/10/2015",
                "transportation":"drop off",
                "location":""
            };
            this.addPatient(data);
            data = {
                "name":"Samantha",
                "date":"10/15/2015",
                "transportation":"pick up",
                "location":"100 Main St., Cambridge, MA 02140"
            };
            this.addPatient(data);
            data = {
                "name":"Howard",
                "date":"09/01/2014",
                "transportation":"drop off",
                "location":""
            };
            this.addPatient(data);
        }
        return this;
    }
    app.controller('FormController', ['Storage', FormController]);
    app.controller('TabController', [TabController]);
    app.controller('PatientListController', ['Storage', PatientListController]);
    app.factory('Storage', Storage);
})();