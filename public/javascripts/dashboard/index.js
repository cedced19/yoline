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
        .when('/account/password', {
            templateUrl: '/views/password.html',
            controller: 'AccountPasswordCtrl'
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
}])
.controller('AccountCtrl', ['$scope', '$location', '$http',  '$cookieStore', '$rootScope', function($scope, $location, $http, $cookieStore, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'My account',
                url: 'account'
            },
            subcategory: false
        };
        $scope.user = $cookieStore.get('yoline-user');
}])
.controller('AccountPasswordCtrl', ['$scope', '$location', '$http',  '$cookieStore', '$rootScope', function($scope, $location, $http, $cookieStore, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'My account',
                url: 'account'
            },
            subcategory: 'Change password'
        };
        $scope.user = $cookieStore.get('yoline-user');
        $scope.change = function () {
            if ($scope.password.new == $scope.password.confirm) {
                $scope.user.password = $scope.password.new;
                $http.put('/api/users/' + $scope.user.id, $scope.user).success(function() {
                    $.snackbar({content: 'Password has just been changed!'});
                });
            } else {
                $.snackbar({content: 'The passwords don\'t mach each other.'});
            }
        };
}]);
