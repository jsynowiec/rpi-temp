import Promise from 'bluebird';
import fs from 'fs';

const readFile = Promise.promisify(fs.readFile);

const BASE_DIRECTORY = '/sys/bus/w1/devices',
  SLAVE_FILE = 'w1_slave',
  SENSORS = {
    DS18S20: 10,
    DS1822:  22,
    DS18B20: 28
  };

export const SENSOR_TYPES = {
  THERM_SENSOR_DS18S20: 'DS18S20',
  THERM_SENSOR_DS1822:  'DS1822',
  THERM_SENSOR_DS18B20: 'DS18B20'
};

export default class Sensor {
  constructor (deviceType, deviceId) {
    this.deviceType = deviceType;
    this.deviceId = deviceId;
  }

  get type () {
    return this.deviceType;
  }

  get id () {
    return this.deviceId;
  }

  /**
   * Reads current temperature from the sensor.
   *
   * @returns {Promise}
   */
  getTemp () {
    return readFile(BASE_DIRECTORY + '/' + SENSORS[this.deviceType] + '-' + this.deviceId + '/' + SLAVE_FILE)
      .then((str) => /(?:t=)(\d+)/.exec(str)[1])
      .then((t) => Number(t * 0.001));
  }
}
