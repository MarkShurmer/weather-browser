'use strict';

describe('Weather service tests', function () {

  var httpMock;
  var service;

  beforeEach(module('myApp'));

  beforeEach(inject(function ($httpBackend, _WeatherService_) {
    httpMock = $httpBackend;
    service = _WeatherService_;

  }));

  describe('get cities', function () {

    it('should return cities', function () {
      var cities = service.getCities();
      expect(cities.length).toBeGreaterThan(0);

      angular.forEach(cities, function (city) {
        expect(city).toBeDefined();
        expect(city).toEqual(jasmine.any(String));
      });
    });
  });

  describe('get forecast', function () {

    it('should make its http call successfully', function () {
      var fakeData = {city: {name: 'Berlin'}};
      httpMock.when('GET', '')
        .respond(fakeData);

      service.getForecast('Berlin')
        .then(function (data) {
          expect(data).toBe(fakeData);
        });
    });

    it('should make return error when http call goes wrong', function () {
      httpMock.when('GET', '')
        .respond(500);

      service.getForecast('Berlin')
        .catch(function (err) {
          expect(err).toBeDefined();
        });
    });

    it('should add days to data', function () {
      var fakeData = {
        city: {name: 'Berlin'}, list: [{
          dt: 1468972800, main: {
            temp: 29.43,
            temp_max: 33.37,
            temp_min: 23.54
          }
        }]
      };

      httpMock.when('GET', '')
        .respond(fakeData);

      service.getForecast('Berlin')
        .then(function (data) {
          expect(data).toBe(fakeData);
          expect(service.weatherData.cityName).toBe('Berlin');
          expect(service.weatherData.forecast).toBeDefined();
          expect(service.weatherData.forecast.length).toBe(1);
          expect(service.weatherData.forecast[0].day.toString()).toBe('20072016');
          expect(service.weatherData.forecast[0].time).toBe('00:00');
        });
    });
  });
});