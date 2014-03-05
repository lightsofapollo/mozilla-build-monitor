var Schema = require('amqpworkers/schema');

function buildQueue(queue) {
  return new Schema({
    queues: [
      [queue, { durable: true }]
    ],

    exchanges: [],

    binds: [
      // listen to all messages from the build exchange
      [queue, 'org.mozilla.exchange.build', '#']
    ]
  });
}

module.exports = buildQueue;
