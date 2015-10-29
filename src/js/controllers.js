(function() {
    var app = angular.module('shuffling', []);

    function TabController($scope) { // controller to manage tab changes
        var vm = this;
        vm.tab = {};
        vm.tab.currenttab = 1; // initialize tab to first tab
        vm.setTab = function(tabnum) { // function to set tab
            vm.tab.currenttab = tabnum;
        };
        vm.checkTab = function(tabnum) { // function to check with tab is currently set
            return vm.tab.currenttab === tabnum;
        };
        $scope.$on("tabchange", function(event, change_to_tab) { // watches for a tabchange emit, changes tab to 2
            vm.setTab(change_to_tab);
        });
    }

    function FormController(storageService, $scope) { // controller to manage form behavior
        var vm = this;
        vm.patient = {};
        vm.patient.transportation = 'pick up';
        vm.submit = function () { // submission function
            var patient_data = { // set up patient data
                "name": vm.patient.name,
                "date": vm.patient.transition_date,
                "transportation": vm.patient.transportation,
                "location": vm.patient.location || ""
            };
            // clear form
            vm.patient.name = "";
            vm.patient.transition_date = "";
            vm.patient.transportation = "pick up";
            vm.patient.location = "";
            // use service to add patient
            storageService.addPatient(patient_data);
            // change tab to '2'
            $scope.$emit("tabchange",2);
        };
        vm.checkName = function(name) { // name comparison function
            return vm.patient.name === name;
        };
        vm.checkDate = function(date) { // transition date comparison function
            return vm.patient.transition_date === date;
        };
        vm.checkTransportation = function(transportation) { // transportation comparison function
            return vm.patient.transportation === transportation;
        };
        vm.checkLocation = function(location) { // location comparison function
            return vm.patient.location === location;
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

    app.controller('TabController', ['$scope', TabController]);
    app.controller('FormController', ['Storage', '$scope', FormController]);
    app.controller('PatientListController', ['Storage', PatientListController]);
})();