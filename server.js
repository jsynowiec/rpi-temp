import {SENSOR_TYPES, Sensor} from './modules/ds18x20';
import express from 'express';
import http from 'http';
import io from 'socket-io';

let ds18b20 = new Sensor(SENSOR_TYPES.THERM_SENSOR_DS18B20, '0000062f17e2');

let app = express(),
  server = http.createServer(app),
  socket = io(server);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendfile('public/index.html');
});

server.listen(3000, () => {
  console.log('Server is listening.');
});

socket.on('connection', () => {
  console.log('Client connected');
});

setInterval(() => {
  ds18b20.getTemp()
      .then((temp) => {
        socket.emit('temperature:readout', {
          timestamp: Math.floor(Date.now() / 1000),
          sensor: {
            type: ds18b20.getType(),
            id: ds18b20.getId()
          },
          value: temp
        });
      });
}, 1000);
