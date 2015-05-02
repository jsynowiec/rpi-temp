(function () {
  'use strict';

  var ds18x20 = require('./modules/ds18x20'),
      ds18b20 = new ds18x20.Sensor(ds18x20.THERM_SENSOR_DS18B20, '0000062f17e2');

  var express = require('express'),
      app = express(),
      server = require('http').createServer(app),
      io = require('socket.io')(server);

  server.listen(3000, function () {
    console.log('Server is listening.');
  });

  io.on('connection', function () {
    console.log('Client connected');
  });

  setInterval(function () {
    ds18b20.getTemp()
        .then(function (temp) {
                  io.emit('temperature:readout', {
                    timestamp: Math.floor(Date.now() / 1000),
                    sensor: {
                      type: ds18b20.getType(),
                      id: ds18b20.getId()
                    },
                    value: temp
                  });
              });
  }, 1000);

})();
