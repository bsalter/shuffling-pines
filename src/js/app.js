(function() {
    var app = angular.module('shuffling', []);

    function TabController($scope) { // controller to manage tab changes
        var vm = this;
        vm.tab = 1; // initialize tab to first tab
        vm.setTab = function(tabnum) { // function to set tab
            vm.tab = tabnum;
        };
        vm.checkTab = function(tabnum) { // function to check with tab is currently set
            return vm.tab === tabnum;
        };
        $scope.$on("tabchange", function(event, change_to_tab) { // watches for a tabchange emit, changes tab to 2
            vm.setTab(change_to_tab);
        });
    }

    function FormController(storageService, $scope) { // controller to manage form behavior
        var vm = this;
        vm.transportation = 'pick up';
        vm.submit = function () { // submission function
            var patient_data = { // set up patient data
                "name": vm.name,
                "date": vm.transition_date,
                "transportation": vm.transportation,
                "location": vm.location || ""
            };
            // clear form
            vm.name = "";
            vm.transition_date = "";
            vm.transportation = "pick up";
            vm.location = "";
            // use service to add patient
            storageService.addPatient(patient_data);
            // change tab to '2'
            $scope.$emit("tabchange",2);
        };
        vm.checkName = function(name) { // name comparison function
            return vm.name === name;
        };
        vm.checkDate = function(date) { // transition date comparison function
            return vm.transition_date === date;
        };
        vm.checkTransportation = function(transportation) { // transportation comparison function
            return vm.transportation === transportation;
        };
        vm.checkLocation = function(location) { // location comparison function
            return vm.location === location;
        };
    }

    function PatientListController(storageService) { // controller to manage patient list behavior
        var vm = this;
        var patients = storageService.getPatients(); // initialize patients list using service
        vm.getPatients = function() { // make patients list accessible to view
            return patients;
        };
        vm.checkLocation = function(transportation) { // check if current transportation is "pick up", used to determine whether to display location
            return (transportation === "pick up");
        };
        vm.getOptions = function(current_transportation) { // get options list for select
            if(current_transportation === "pick up" || current_transportation === "drop off") {
                return [current_transportation,"arrived"];
            } else {
                return ["arrived","pick up"];
            }
        };
        vm.changeField = function(fieldname, value, key) { // update patient based on user input
            storageService.updatePatient(fieldname, value, key);
        };
        vm.delete = function(key, ignoreConfirm) { // delete patient based on user input
            if(confirm("Really delete this record?") || ignoreConfirm) { // ignoreConfirm is for testing
                storageService.deletePatient(key);
            }
            patients = storageService.getPatients(); // needed for reactivity
        };
        vm.checkDeleted = function(record) { // check if record is deleted
            return (record.deleted === 1);
        };
    }

    function Storage() { // localStorage service
        this.patients = JSON.parse(localStorage.getItem('patients')) || []; // initialize patients list
        console.log(this.patients);
        this.addPatient = function(patient) { // add patient to local storage
            this.patients.push(patient);
            localStorage.setItem('patients',angular.toJson(this.patients));
            // make sure we stored it correctly
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        this.getPatients = function() { // return current patients list/state
            return this.patients;
        };
        this.updatePatient = function(fieldname, value, key) { // update patient in local storage
            this.patients[key][fieldname] = value;
            localStorage.setItem('patients',angular.toJson(this.patients));
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        this.deletePatient = function(key) { // set deleted flag for patient in local storage
            this.patients[key].deleted = 1; // logical delete
            localStorage.setItem('patients', angular.toJson(this.patients));
            console.log(JSON.parse(localStorage.getItem('patients')));
        };
        if(this.patients.length === 0) { // initialize with example data
            console.log("Begin initialization");
            var data = {
                "name":"Frank",
                "date":"2014-12-31",
                "transportation":"drop off",
                "location":""
            };
            this.addPatient(data);
            data = {
                "name":"Samantha",
                "date":"2015-10-15",
                "transportation":"pick up",
                "location":"100 Main St., Cambridge, MA 02140"
            };
            this.addPatient(data);
            data = {
                "name":"Howard",
                "date":"2015-02-14",
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