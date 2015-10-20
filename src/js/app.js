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
        var patients = storageService.getPatients();
        var patients_length = patients.length;
        vm.submit = function () {
            var patient_data = {
                "name": vm.name,
                "date": vm.transition_date,
                "transportation": vm.transportation,
                "location": vm.location || "",
                "id": patients_length + 1
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
        vm.changeField = function(fieldname, value, id) {
            storageService.update(fieldname, value, id)
        };
        vm.delete = function(id) {
            if(confirm("Really delete this record?")) {
                angular.forEach(patients, function (record, key) {
                    if (record.id === id) {
                        patients[key].deleted = 1;
                    }
                });
                localStorage.setItem('patients', angular.toJson(patients));
            }
        };
        vm.checkDeleted = function(record) {
            return (record.deleted === 1);
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
        this.update = function(fieldname, value, id) {
            var records = JSON.parse(localStorage.getItem('patients'));
            angular.forEach(records, function(record, key) {
                if(record.id === id) {
                    records[key][fieldname] = value;
                }
            });
            localStorage.setItem('patients',angular.toJson(records));
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        this.delete = function(id) {

        };
        if(this.patients.length == 0) { // initialize with example data
            console.log("Begin initialization");
            var data = {
                "name":"Frank",
                "date":new Date("2014-12-31T05:00:00.000Z"),
                "transportation":"drop off",
                "location":"",
                "id":"1"
            };
            this.addPatient(data);
            data = {
                "name":"Samantha",
                "date":new Date("2015-10-15T05:00:00.000Z"),
                "transportation":"pick up",
                "location":"100 Main St., Cambridge, MA 02140",
                "id":"2"
            };
            this.addPatient(data);
            data = {
                "name":"Howard",
                "date":new Date("2015-02-14T05:00:00.000Z"),
                "transportation":"drop off",
                "location":"",
                "id":"3"
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