window.$ = require('jquery');
require('./init-ui.js');
require('./snackbar.js');
require('angular');
require('angular-route');
require('angular-sanitize');
require('angular-cookies');
require('./edit/text-angular-rangy.min.js');
require('./edit/text-angular-sanitize.min.js');
require('./edit/text-angular.min.js');
require('ng-tags-input');

var errorHandler = function () {
    $.snackbar({content: 'An error has occured!'});
};
angular.module('Dashboard', ['ngRoute', 'ngSanitize', 'ngCookies', 'textAngular', 'ngTagsInput'])
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
        .when('/users', {
            templateUrl: '/views/users.html',
            controller: 'UsersCtrl'
        })
        .when('/users/new', {
            templateUrl: '/views/users-new.html',
            controller: 'UsersNewCtrl'
        })
        .when('/articles', {
            templateUrl: '/views/articles.html',
            controller: 'ArticlesCtrl'
        })
        .when('/articles/new', {
            templateUrl: '/views/articles-new.html',
            controller: 'ArticlesNewCtrl'
        })
        .when('/articles/:id', {
            templateUrl: '/views/articles-update.html',
            controller: 'ArticlesUpdateCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}])
.directive('toolbarTip', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            $(element).toolbar(scope.$eval(attrs.toolbarTip));
        }
    };
})
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
            if ($scope.password.new == $scope.password.confirm && password.new != '') {
                $scope.user.password = $scope.password.new;
                $http.put('/api/users/' + $scope.user.id, $scope.user).success(function() {
                    $.snackbar({content: 'Password has just been updated!'});
                }).error(errorHandler);
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
            }).error(errorHandler);
        };
}])
.controller('UsersCtrl', ['$scope', '$location', '$http', '$rootScope', '$cookieStore', function($scope, $location, $http, $rootScope,  $cookieStore) {
        $rootScope.nav = {
            category: {
                title: 'Users',
                url: 'users'
            },
            subcategory: false
        };
        $scope.user = $cookieStore.get('yoline-user');

        $http.get('/api/users').success(function (data) {
            $scope.users = data;

            $scope.delete = function (user) {
                 if (user.id == $scope.user.id) {
                    $.snackbar({content: 'You can\'t delete yourself!'});
                    $scope.confirm = false;
                } else {
                     $http.delete('/api/users/' + user.id).success(function () {
                        $scope.users.splice($scope.users.indexOf(user), 1);
                        $scope.confirm = false;
                        $.snackbar({content: 'User has just been deleted!'});
                     }).error(errorHandler);
                 }
            };
        });
}])
.controller('UsersNewCtrl', ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'Users',
                url: 'users'
            },
            subcategory: 'Add an new user'
        };
        $scope.create = function () {
            if ($scope.password.password == $scope.password.confirm && password.password != '') {
                $scope.user.password = $scope.password.password;
                $http.post('/api/users/', $scope.user).success(function() {
                    $location.path('/users');
                    $.snackbar({content: 'User has just been updated!'});
                }).error(errorHandler);
            } else {
                $.snackbar({content: 'The passwords don\'t mach each other.'});
            }
        };
}])
.controller('ArticlesCtrl', ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'Articles',
                url: 'articles'
            },
            subcategory: false
        };

        $http.get('/api/articles').success(function (data) {
            $scope.articles = data;

            angular.forEach($scope.articles, function(value, key) {
                var keywords = '';
                angular.forEach(value.keywords, function(value, key) {
                        keywords += ' ';
                        keywords += value;
                 });
                $scope.articles[key].keywords = keywords;
            });

            $scope.delete = function (article) {
                     $http.delete('/api/articles/' + article.id).success(function () {
                        $scope.articles.splice($scope.articles.indexOf(article), 1);
                        $scope.confirm = false;
                        $.snackbar({content: 'Article has just been deleted!'});
                     }).error(errorHandler);
            };

            $scope.update = function (article) {
                    $location.path('/articles/' + article.id);
            };
        });
}])
.controller('ArticlesNewCtrl', ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {
        $rootScope.nav = {
            category: {
                title: 'Articles',
                url: 'articles'
            },
            subcategory: 'Add an new article'
        };
        $scope.publish = function () {
            if ($scope.newArticle.tags.length < 3) {
                $.snackbar({content: 'You must set at least three keywords!'});
            } else if ($scope.newArticle.title == '') {
                $.snackbar({content: 'You must set a title!'});
            } else {
                var article = {
                    title: $scope.newArticle.title,
                    content: $scope.newArticle.content,
                    keywords: []
                };
                angular.forEach($scope.newArticle.tags, function(value, key) {
                    article.keywords.push(value.text);
                });
                $http.post('/api/articles', article).success(function (data) {
                    $.snackbar({content: 'Articles has just been created!'});
                    $location.path('/articles/' + data.id);
                }).error(errorHandler);
            }
        };
}])
.controller('ArticlesUpdateCtrl', ['$scope', '$location', '$http', '$rootScope', '$routeParams', function($scope, $location, $http, $rootScope, $routeParams) {
        $rootScope.nav = {
            category: {
                title: 'Articles',
                url: 'articles'
            },
            subcategory: 'Update an article'
        };
        $http.get('/api/articles/' + $routeParams.id).success(function (data) {
            $scope.currentArticle = data;
            $scope.tags = [];
            angular.forEach(data.keywords, function(value, key) {
                    $scope.tags.push({text: value});
            });
            $scope.update = function () {
                if ($scope.tags.length < 3) {
                    $.snackbar({content: 'You must set at least three keywords!'});
                } else if ($scope.currentArticle.title == '') {
                    $.snackbar({content: 'You must set a title!'});
                } else {
                    $scope.currentArticle.keywords = []
                    angular.forEach($scope.tags, function(value, key) {
                        $scope.currentArticle.keywords.push(value.text);
                    });
                    $http.put('/api/articles/' + $routeParams.id, $scope.currentArticle).success(function () {
                        $.snackbar({content: 'Articles has just been updated!'});
                    }).error(errorHandler);
                }
        };
        });
}]);
