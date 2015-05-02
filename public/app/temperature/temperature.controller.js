(function () {
  'use strict';

  angular.module('rpiTemp')
      .controller('tempCtrl', [
        'socket', '$scope', function (socket, $scope) {
          var maximum = 300;

          $scope.currentTemp = null;

          $scope.labels = [];
          $scope.data = [[]];
          $scope.options = {
            animation: false,
            showScale: true,
            scaleIntegersOnly: true,
            scaleBeginAtZero: true,
            showTooltips: false,
            pointDot: false,
            datasetStrokeWidth: 0.5
          };

          socket.on('temperature:readout', function (data) {
            if ($scope.data[0].length === maximum) {
              $scope.labels = $scope.labels.slice(1);
              $scope.data[0] = $scope.data[0].slice(1);
            }

            $scope.currentTemp = Number(data.value).toFixed(1);

            $scope.labels.push('');
            $scope.data[0].push($scope.currentTemp);

            $scope.$apply();
          });
        }
      ]);

})();
