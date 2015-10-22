describe('FormController', function() {
    var formController;
    var scope;
    var storageService;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller, $rootScope) {
        scope = $rootScope.$new();
        spyOn(scope,'$broadcast');
        storageService = jasmine.createSpyObj('storageService',['submit','checkName','checkDate','checkTransportation','checkLocation']);
        formController = $controller('FormController', {storageService:storageService, $scope:scope});
    }));

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
    beforeEach(module('shuffling'));
    beforeEach(inject(function($controller) {
        patientListController = $controller('PatientListController');
    }));

});