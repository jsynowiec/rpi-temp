(function () {
  'use strict';

  angular.module('rpiTemp')
      .factory('socket', function () {
                 return io();
               });

})();