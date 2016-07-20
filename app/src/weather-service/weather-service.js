'use strict';

angular.module('myApp')
  .factory('WeatherService', ['$http', '$q', 'dateFormat', function ($http, $q, dateFormat) {
    var factory = {weatherData: {}};

    factory.getCities = function () {
      return ['Amsterdam', 'Cape town', 'Dublin', 'London', 'New York', 'Paris', 'Washington'];
    };

    factory.getForecast = function (city) {
      var deferred = $q.defer();

      // work out right param
      var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' + city +
        '&units=metric&appid=d5df3c09f09f3db2695416e4e769b1cb';

      $http.get(url, { cache: true})
        .then(function (resp) {
          organiseData(resp.data);
          deferred.resolve(factory.weatherData);
        })
        .catch(function (err) {
          deferred.reject(err);
        });

      return deferred.promise;
    };

    factory.getImage = function(dayForecast) {
      var url = 'http://openweathermap.org/img/w/' + dayForecast.weatherIcon + '.png';
      return $http.get(url, { cache: true});
    };

    var organiseData = function (data) {
      factory.weatherData.cityName = data.city.name;
      factory.weatherData.forecast = [];

      for (var index = 0; index < data.list.length; index++) {
        // get day for entry
        var dateOfEntry = new Date(data.list[index].dt_txt);
        // check to see if day already there
        var dayEntry = factory.weatherData.forecast.find(function (fcItem) {
          return fcItem.day === dateOfEntry.getDay();
        });

        if (!angular.isDefined(dayEntry)) {
          // need new entry for day
          dayEntry = {
            day: dateOfEntry.getDay(),
            dayDesc: dateFormat(dateOfEntry, 'ddd dd mmm'),
            minTemp: 999,
            maxTemp: 0,
            sections: []
          };
          factory.weatherData.forecast.push(dayEntry);
        }

        dayEntry.sections.push({
          time: dateFormat(dateOfEntry, 'HH:MM'),
          temp: data.list[index].main.temp,
          humidity: data.list[index].main.humidity,
          weatherIcon: data.list[index].weather[0].icon,
          weatherDesc: data.list[index].weather[0].description
        });

        // adjust min and max for day
        dayEntry.minTemp = Math.min(dayEntry.minTemp, data.list[index].main.temp_min);
        dayEntry.maxTemp = Math.max(dayEntry.maxTemp, data.list[index].main.temp_max);
      }
    };

    return factory;
  }]);