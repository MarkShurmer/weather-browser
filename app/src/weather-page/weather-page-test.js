'use strict';

describe('myApp.weather page', function() {

  beforeEach(module('myApp'));

  describe('weather controller', function(){
    var ctrl;
    var mockService = jasmine.createSpyObj(['getCities', 'getForecast']);

    beforeEach(inject(function($q) {
      ctrl =  new WeatherPageCtrl(mockService);
      var deferred = $q.defer();
      mockService.getForecast.and.returnValue(deferred.promise);
    }));

    it('should create controller', function() {
      expect(ctrl).toBeDefined();
      expect(mockService.getCities).toHaveBeenCalled();
    });

    it('should call get forecast when changing city', function() {

      ctrl.selectedCity = 'Rome';
      ctrl.changeCity();
      expect(mockService.getForecast).toHaveBeenCalledWith('Rome');
    });

  });
});