describe('FormController', function() {
    var formController;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller) {
        formController = $controller('FormController');
    }));

});

describe('TabController', function() {
    var tabController;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller) {
        tabController = $controller('TabController');
    }));

});

describe('PatientListController', function() {
    var patientListController;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller) {
        patientListController = $controller('PatientListController');
    }));

});