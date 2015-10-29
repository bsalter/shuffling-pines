(function() {
    var app = angular.module('shuffling');

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
    app.service('Storage', Storage);
})();