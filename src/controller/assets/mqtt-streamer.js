/* eslint-disable linebreak-style */
/* eslint-disable no-console */
const WebSocketClient = require('websocket').client;
const mqtt = require('mqtt');

const port = 8090;

module.exports = (db) => {
  const mqttClient = mqtt.connect('mqtt://broker.mqttdashboard.com');
  const wsClient = new WebSocketClient();
  let lastEnergyPacket = new Date().getTime();

  wsClient.on('connect', async (connection) => {
    mqttClient.on('connect', () => {
      mqttClient.subscribe('appropos', (err) => {
        if (!err) {
          // mqttClient.publish('appropos', 'Backend online')
        } else {
          console.log(err);
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
      // basic things
      const dataPoint = JSON.parse(message.toString());
      dataPoint.timeStamp = new Date().getTime();
      const hoursDelta = (new Date().getTime() - lastEnergyPacket) / (1000 * 60 * 60);

      // if this is a sensor
      for (const key in dataPoint) {
        if (!(['solr_amp', 'wind_amp', 'solr_volt', 'wind_volt', 'timeStamp'].includes(key))) {
          const objectToPush = {
            type: key,
            value: dataPoint[key],
            timeStamp: dataPoint.timeStamp,
          };
          db.collection(key).insertOne(objectToPush);
        }
      }

      let wind = dataPoint.wind_amp * dataPoint.wind_volt;
      dataPoint.wind_watt = wind;
      dataPoint.wind_percentage = wind / 3.2;
      wind *= wind * hoursDelta;
      wind = {
        type: 'wind',
        watthours: wind,
        volt: dataPoint.wind_volt,
        amp: dataPoint.wind_amp,
        timeStamp: dataPoint.timeStamp,
      };
      db.collection('wind').insertOne(wind);

      let solr = dataPoint.solr_amp * dataPoint.solr_volt;
      dataPoint.solr_watt = solr;
      dataPoint.solr_percentage = solr / 2.4;
      solr *= solr * hoursDelta;
      solr = {
        type: 'solr',
        watthours: solr,
        volt: dataPoint.solr_volt,
        amp: dataPoint.solr_amp,
        timeStamp: dataPoint.timeStamp,
      };
      db.collection('solr').insertOne(solr);


      lastEnergyPacket = new Date().getTime();
      // broadcast to ws


      // Änderungen für Viet
      dataPoint.temp /= 1000;
      dataPoint.solr = {
        amp: dataPoint.solr_amp,
        volt: dataPoint.solr_volt,
        watt: dataPoint.solr_watt,
        percentage: Math.round(dataPoint.solr_percentage * 100),
      };

      dataPoint.wind = {
        amp: dataPoint.wind_amp,
        volt: dataPoint.wind_volt,
        watt: dataPoint.wind_watt,
        percentage: Math.round(dataPoint.wind_percentage * 100),
      };

      const removeList = ['wind_amp', 'wind_volt', 'wind_watt', 'wind_percentage', 'solr_amp', 'solr_volt', 'solr_watt', 'solr_percentage'];

      removeList.forEach((key) => {
        delete dataPoint[key];
      });

      connection.send(JSON.stringify(dataPoint));
      console.log(JSON.stringify(dataPoint));
    });
  });

  wsClient.connect(`ws://localhost:${port}`);
};
