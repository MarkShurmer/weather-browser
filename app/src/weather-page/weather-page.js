'use strict';

angular.module('myApp')
  .component('wtWeatherPage', {
    controller: WeatherPageCtrl,
    templateUrl: 'weather-page/weather-page.html'
  });

function WeatherPageCtrl(WeatherService) {
  var wpCtrl = this;

  wpCtrl.cities = WeatherService.getCities();

  wpCtrl.changeCity = function() {
      wpCtrl.isLoading = true;
      WeatherService.getForecast(wpCtrl.selectedCity)
        .then(function(resp) {
          wpCtrl.weatherData = resp;
          wpCtrl.isLoading = false;
        })
        .catch(function() {
          wpCtrl.error = 'Unable to get weather data from server';
        })
  };

}