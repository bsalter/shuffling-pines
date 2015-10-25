(function() {
    var app = angular.module('shuffling', []);

    function TabController($scope) {
        var vm = this;
        vm.tab = 1;
        vm.setTab = function(tabnum) {
            vm.tab = tabnum;
        };
        vm.checkTab = function(tabnum) {
            return vm.tab === tabnum;
        };
        $scope.$on("tabchange", function() {
            vm.setTab(2);
        });
    }

    function FormController(storageService, $scope) {
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
            $scope.$emit("tabchange",2);
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
        };
    }

    function PatientListController(storageService) {
        var vm = this;
        var patients = storageService.getPatients();
        // Angular's date input requires a Date object
        angular.forEach(patients, function(patient, key) {
            patients[key].date = new Date(patient.date);
        });
        vm.getPatients = function() {
            return patients;
        };
        vm.checkLocation = function(transportation) {
            return (transportation === "pick up");
        };
        vm.getOptions = function(current_transportation) {
            if(current_transportation == "pick up" || current_transportation == "drop off") {
                return [current_transportation,"arrived"];
            } else {
                return ["arrived","pick up"];
            }
        };
        vm.changeField = function(fieldname, value, key) {
            storageService.updatePatient(fieldname, value, key);
        };
        vm.delete = function(key) {
            storageService.deletePatient(key);
            patients = storageService.getPatients(); // needed for reactivity
        };
        vm.checkDeleted = function(record) {
            return (record.deleted === 1);
        };
    }

    function Storage() {
        this.patients = JSON.parse(localStorage.getItem('patients')) || [];
        console.log(this.patients);
        this.addPatient = function(patient) {
            this.patients.push(patient);
            localStorage.setItem('patients',angular.toJson(this.patients));
            // make sure we stored it correctly
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        this.getPatients = function() {
            return this.patients;
        };
        this.updatePatient = function(fieldname, value, key) {
            var records = JSON.parse(localStorage.getItem('patients'));
            records[key][fieldname] = value;
            localStorage.setItem('patients',angular.toJson(records));
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        this.deletePatient = function(key) {
            if(confirm("Really delete this record?")) {
                this.patients[key].deleted = 1; // logical delete
            }
            localStorage.setItem('patients', angular.toJson(this.patients));
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        if(this.patients.length == 0) { // initialize with example data
            console.log("Begin initialization");
            var data = {
                "name":"Frank",
                "date":new Date("2014-12-31T05:00:00.000Z"),
                "transportation":"drop off",
                "location":""
            };
            this.addPatient(data);
            data = {
                "name":"Samantha",
                "date":new Date("2015-10-15T05:00:00.000Z"),
                "transportation":"pick up",
                "location":"100 Main St., Cambridge, MA 02140"
            };
            this.addPatient(data);
            data = {
                "name":"Howard",
                "date":new Date("2015-02-14T05:00:00.000Z"),
                "transportation":"drop off",
                "location":""
            };
            this.addPatient(data);
        }
    }
    app.controller('TabController', ['$scope', TabController]);
    app.controller('FormController', ['Storage', '$scope', FormController]);
    app.controller('PatientListController', ['Storage', PatientListController]);
    app.service('Storage', Storage);
})();