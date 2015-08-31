window.$ = require('jquery');
require('./init-ui.js');
require('./snackbar.js');
require('angular');

var modules = [
      require('angular-route'),
      require('angular-sanitize'),
      require('angular-cookies')
    ];

angular.module('Dashboard', ['ngRoute', 'ngSanitize', 'ngCookies'])
.config(['$routeProvider', function($routeProvider){
        $routeProvider
        .when('/', {
            templateUrl: '/views/index.html',
            controller: 'IndexCtrl'
        })
        .when('/account', {
            templateUrl: '/views/account.html',
            controller: 'AccountCtrl'
        })
        .when('/account/update', {
            templateUrl: '/views/account-update.html',
            controller: 'AccountUpdateCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}])
.controller('IndexCtrl', ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'Home',
                url: ''
            },
            subcategory: false
        };
        $http.get('/api/version').success(function (data) {
            $scope.version = data;
        });
}])
.controller('AccountCtrl', ['$scope', '$cookieStore', '$rootScope', function($scope, $cookieStore, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'My account',
                url: 'account'
            },
            subcategory: false
        };
        $scope.user = $cookieStore.get('yoline-user');
       if($scope.user.facebook.length == 0) {
            $scope.user.facebook = 'No account registred';
        }
        if ($scope.user.twitter.length == 0) {
            $scope.user.twitter = 'No account registred';
        }
        $scope.user = $cookieStore.get('yoline-user');
}])
.controller('AccountUpdateCtrl', ['$scope', '$http', '$cookieStore', '$rootScope', function($scope, $http, $cookieStore, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'My account',
                url: 'account'
            },
            subcategory: 'Change settings'
        };
        $scope.user = $cookieStore.get('yoline-user');
        $scope.changePassword = function () {
            if ($scope.password.new == $scope.password.confirm) {
                $scope.user.password = $scope.password.new;
                $http.put('/api/users/' + $scope.user.id, $scope.user).success(function() {
                    $.snackbar({content: 'Password has just been updated!'});
                });
            } else {
                $.snackbar({content: 'The passwords don\'t mach each other.'});
            }
        };
        $scope.changeSettings = function () {
            if ($scope.user.facebook == '') {
                delete $scope.user.facebook;
            }
            if ($scope.user.twitter == '') {
                delete $scope.user.twitter;
            }
            $http.put('/api/users/' + $scope.user.id, $scope.user).success(function() {
                $.snackbar({content: 'Your profile has just been updated!'});
            });
        };
}]);
