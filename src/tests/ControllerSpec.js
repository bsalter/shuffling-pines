describe('FormController', function() {
    var formController;
    var scope;
    var storageService;
    localStorage.clear(); // this seems to cause problems when used as a beforeEach
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
    beforeEach(inject(function($controller, _Storage_) {
        storageService = _Storage_;
        spyOn(storageService,'getPatients').and.callThrough();
        patientListController = $controller('PatientListController', {storageService:storageService});
    }));
    it('initializes with a patient list, by calling getPatients on the Storage service', function() {
        expect(storageService.getPatients).toHaveBeenCalled();
    });
    it('returns a list of patients when getPatients is called', function() {
        var patients = patientListController.getPatients();
        expect(typeof patients).toBe('object');
        expect(patients.length).toBe(3);
        var testobj = [
            Object({ name: 'Frank', date:"2014-12-31", transportation: 'drop off', location: '' }),
            Object({ name: 'Samantha', date: "2015-10-15", transportation: 'pick up', location: '100 Main St., Cambridge, MA 02140' }),
            Object({ name: 'Howard', date: "2015-02-14", transportation: 'drop off', location: '' }) ];
        expect(angular.toJson(patients)).toBe(angular.toJson(testobj));
    });
    it('returns a comparison against the string "pick up" when checkLocation is called', function() {
        expect(patientListController.checkLocation("pick up")).toBeTruthy();
        expect(patientListController.checkLocation("drop off")).toBeFalsy();
    });
    it('returns an array containing "arrived" and "pick up" when getOptions is called and the parameter is not "pick up" or "drop off"', function() {
        var testarr = ["arrived","pick up"];
        expect(patientListController.getOptions('arrived')).toEqual(testarr);
    });
    it('returns an array containing the parameter, and "arrived" when getOptions is called and the parameter is either "pick up" or "drop off"', function() {
        var testarr = ["pick up","arrived"];
        expect(patientListController.getOptions('pick up')).toEqual(testarr);
        testarr = ["drop off","arrived"];
        expect(patientListController.getOptions('drop off')).toEqual(testarr);
    });
    it('calls the Storage service function updatePatient(fieldname,value,key) when changeField(fieldname,value,key) is called', function() {
        spyOn(storageService,"updatePatient");
        patientListController.changeField("name","John",1);
        expect(storageService.updatePatient).toHaveBeenCalledWith("name","John",1);
    });
    it('calls the Storage service delete function when delete is called', function() {
        spyOn(storageService,"deletePatient");
        patientListController.delete(1);
        expect(storageService.deletePatient).toHaveBeenCalledWith(1);
    });
    it('returns a comparison against the deleted flag on a record, when checkDeleted is called', function() {
        var record = {};
        record.deleted = 1;
        expect(patientListController.checkDeleted(record)).toBeTruthy();
    });
});

describe('Storage', function() {
    // I'd prefer to test localStorage contents directly, but every attempt I've made to do so results in some very
    // weird behavior. It seems that the jasmine script runs in a separate context from the PhantomJS browser,
    // so when I look at localStorage directly in the test script, I'm looking at the wrong one. So, I'm using the
    // storage service getPatients function for comparisons - I think this is ok because I test getPatients() return
    // value against an array of objects.
    var storageService;
    beforeEach(module('shuffling'));
    beforeEach(inject(function($injector) {
        storageService = $injector.get('Storage');
    }));
    it('initializes with three records, and gets the current list of patients when getPatients is called', function() {
        var patients = storageService.getPatients();
        expect(typeof patients).toBe('object');
        expect(patients.length).toBe(3);
        var testobj = [
            Object({ name: 'Frank', date: "2014-12-31", transportation: 'drop off', location: '' }),
            Object({ name: 'Samantha', date: "2015-10-15", transportation: 'pick up', location: '100 Main St., Cambridge, MA 02140' }),
            Object({ name: 'Howard', date: "2015-02-14", transportation: 'drop off', location: '' }) ];
        expect(angular.toJson(patients)).toBe(angular.toJson(testobj));
    });
    it('adds a patient record to localStorage when addPatient is called', function() {
        expect(storageService.getPatients().length).toBe(3);
        var patient = {name: 'John', date: new Date('2013-12-31T05:00:00.000Z'), transportation: 'drop off', location: ''};
        storageService.addPatient(patient);
        expect(storageService.getPatients().length).toBe(4);
    });
    it('updates a patient record when updatePatient is called', function () {
        storageService.updatePatient('name','Austin',1);
        var patients = storageService.getPatients();
        expect(patients[1].name).toBe('Austin');
    });
    it('sets a deleted flag on a record when deletePatient is called, and calls window.confirm', function() {
        spyOn(window,'confirm');
        storageService.deletePatient(1, true);
        expect(window.confirm).toHaveBeenCalledWith('Really delete this record?');
        var patients = storageService.getPatients();
        expect(patients[1].deleted).toBe(1);
    });
});
