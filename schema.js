var Schema = require('amqpworkers/schema');
var debug = require('debug')('build queue');

function buildQueue(queue) {
  debug('building schema for: ', queue);
  return new Schema({
    queues: [
      [queue, { durable: true }]
    ],

    exchanges: [],

    binds: [
      // listen to all messages from the build exchange
      [queue, 'org.mozilla.exchange.build', 'build.#.finished']
    ]
  });
}

module.exports = buildQueue;
