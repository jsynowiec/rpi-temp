(function () {
  'use strict';

  var Promise = require('bluebird'),
      readFile = Promise.promisify(require('fs').readFile);

  var BASE_DIRECTORY = '/sys/bus/w1/devices',
      SLAVE_FILE = 'w1_slave',
      SENSORS = {
        DS18S20: 10,
        DS1822: 22,
        DS18B20: 28
      };

  module.exports = {
    THERM_SENSOR_DS18S20: 'DS18S20',
    THERM_SENSOR_DS1822: 'DS1822',
    THERM_SENSOR_DS18B20: 'DS18B20',

    /**
     * DS18x20 sensor class.
     *
     * @param {string} deviceType
     * @param {string} deviceId
     * @constructor
     */
    Sensor: function (deviceType, deviceId) {
      function getTemp(str) {
        return /(?:t=)(\d+)/.exec(str)[1];
      }

      function parseTemp(t) {
        return Number(t * 0.001);
      }

      /**
       * Returns this sensor type, eg. DS18B20.
       *
       * @returns {String}
       */
      this.getType = function () {
        return deviceType;
      };

      /**
       * Returns this sensor hwId, eg. 0000062f17e2
       *
       * @returns {String}
       */
      this.getId = function () {
        return deviceId;
      };

      /**
       * Reads current temperature from the sensor.
       *
       * @returns {Promise}
       */
      this.getTemp = function () {
        return readFile(BASE_DIRECTORY + '/' + SENSORS[deviceType] + '-' + deviceId + '/' + SLAVE_FILE)
          .then(getTemp)
          .then(parseTemp);
      };
    }
  };

})();
