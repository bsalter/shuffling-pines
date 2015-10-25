describe('FormController', function() {
    var formController;
    var scope;
    var storageService;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller, $rootScope, _Storage_) {
        scope = $rootScope.$new();
        spyOn(scope,'$emit').and.callThrough();
        storageService = _Storage_;
        formController = $controller('FormController', {storageService:storageService, $scope:scope});
    }));
    it('Accurately compares controller scope variable name with name parameter passed into checkName', function() {
        formController.name = "Harvey";
        expect(formController.checkName('Harvey')).toBeTruthy();
        expect(formController.checkName('Larry')).toBeFalsy();
    });
    it('Accurately compares controller scope variable transition_date with date parameter passed into checkDate', function() {
        formController.transition_date = "10/15/2015";
        expect(formController.checkDate('10/15/2015')).toBeTruthy();
        expect(formController.checkDate('10/16/2015')).toBeFalsy();
    });
    it('Accurately compares controller scope variable transportation with transportation parameter passed into checkTransportation', function() {
        formController.transportation = "pick up";
        expect(formController.checkTransportation('pick up')).toBeTruthy();
        expect(formController.checkTransportation('drop off')).toBeFalsy();
    });
    it('Accurately compares controller scope variable location with location parameter passed into checkLocation', function() {
        formController.location = "My house";
        expect(formController.checkLocation('My house')).toBeTruthy();
        expect(formController.checkLocation('Other house')).toBeFalsy();
    });
    it('Calls storage service add patient method, then clears scope variables (except transportation), when submit function is called', function() {
        spyOn(storageService,'addPatient');
        formController.name = "Harvey";
        formController.transition_date = "10/15/2015";
        formController.transportation = "pick up";
        formController.location = "My house";
        formController.submit();
        expect(formController.name).toBe("");
        expect(formController.transition_date).toBe("");
        expect(formController.transportation).toBe("pick up");
        expect(formController.location).toBe("");
        expect(storageService.addPatient).toHaveBeenCalled();
    });
});

describe('TabController', function() {
    var tabController;
    var scope;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        spyOn(scope,'$on').and.callThrough();
        tabController = $controller('TabController', {$scope:scope});
    }));
    it('initializes tab to 1', function() {
        expect(tabController.tab).toBe(1);
        expect(tabController.checkTab(1)).toBeTruthy();
        expect(tabController.checkTab(2)).toBeFalsy();
    });
    it('sets tab to 2 when setTab(2) is called', function() {
        tabController.setTab(2);
        expect(tabController.tab).toBe(2);
        expect(tabController.checkTab(1)).toBeFalsy();
        expect(tabController.checkTab(2)).toBeTruthy();
    });
    it('sets tab to 1 when setTab(1) is called', function() {
        tabController.setTab(1);
        expect(tabController.tab).toBe(1);
    });
    it('responds to a tabchange 2 broadcast by setting tab to 2', function() {
        tabController.setTab(1);
        expect(tabController.tab).toBe(1);
        var childscope = scope.$new();
        childscope.$emit("tabchange",2);
        expect(scope.$on).toHaveBeenCalled();
        expect(tabController.tab).toBe(2);
    });
    it('returns true when tab is 2 and checkTab(2) is called', function() {
        tabController.setTab(2);
        expect(tabController.checkTab(1)).toBeFalsy();
        expect(tabController.checkTab(2)).toBeTruthy();
    });
});

describe('PatientListController', function() {
    var patientListController;
    var storageService;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller, _storageService_) {
        storageService = _storageService_;
        patientListController = $controller('PatientListController', {storageService:storageService});
    }));
});

describe('Storage', function() {
    var storage;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($injector) {
        storage = $injector.get('Storage');
    }));
});
