// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('HomeCtrl', function($scope, $http, $ionicPopup, $rootScope, $state){
    // Confusions
    $http.get('json/confusions.json').success(function(confusion, status, headers, config) {
      $scope.appareils = confusion;
    }).error(function(confusion, status, headers, config) {
      // log error
    });

    // Focals
    $http.get('json/focals.json').success(function(focal, status, headers, config) {
      $scope.focals = focal;
    }).error(function(focal, status, headers, config) {
      // log error
    });

    // Ouvertures
    $http.get('json/ouvertures.json').success(function(open, status, headers, config) {
      $scope.ouvertures = open;
    }).error(function(open, status, headers, config) {
      // log error
    });

    $scope.calcul = function(modele, focal, ouverture, distance){
      if(!distance || !focal || !ouverture || !distance){
        var alertPopup = $ionicPopup.alert({
          title: 'Ca chie !!',
          subTitle: 'Il manque des infos pour faire le calcul !',
          cssClass: 'error',
          template: '',
          okText: 'Corriger',
          okType: 'button-assertive',
        });
      } else {

        $rootScope.confusion = modele;
        $rootScope.focal = focal;
        $rootScope.ouverture = ouverture;
        $rootScope.distance = distance;

        $state.go('results');
      }
    }

})

.controller('ResultsCtrl', function($scope, $rootScope){

  $scope.confusion = $rootScope.confusion;
  $scope.focal = $rootScope.focal;
  $scope.ouverture = $rootScope.ouverture;
  $scope.distance = $rootScope.distance/100;

  $scope.hyperfocal = Math.round(100*(($scope.focal*$scope.focal)/(1000*$scope.confusion*$scope.ouverture)))/100;

  $scope.premier = (($scope.hyperfocal*parseFloat($scope.distance))/($scope.hyperfocal+parseFloat($scope.distance)))*100;
  $scope.dernier = (($scope.hyperfocal*parseFloat($scope.distance))/($scope.hyperfocal-parseFloat($scope.distance)))*100;

  $scope.pdc = Math.round(100*($scope.dernier-$scope.premier))/100;
  $scope.premier = Math.round(100*$scope.premier)/100;
  $scope.dernier = Math.round(100*$scope.dernier)/100;


})

// Routes
.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/home',
    templateUrl: 'views/home.html',
    controller: 'HomeCtrl'
  })

  $stateProvider.state('results', {
    url: '/results',
    templateUrl: 'views/results.html',
    controller: 'ResultsCtrl'
  })

  $urlRouterProvider.otherwise('/home')

});
