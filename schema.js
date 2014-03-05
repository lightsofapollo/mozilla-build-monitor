var Schema = require('amqpworkers/schema');
var debug = require('debug')('build queue');

var MESSAGE_TTL_MS =
   // one minute
   (1000 * 60) *
   // one hour
   60 *
   // four hours
   4;

function buildQueue(queue, durable) {
  debug('building schema for: ', queue);

  var queueConfig = {
    messageTtl: MESSAGE_TTL_MS
  };

  if (durable) {
    queueConfig.durable = true;
  } else {
    queueConfig.autoDelete = true;
    queueConfig.durable = false;
  }

  debug('queue config', queueConfig);

  return new Schema({
    queues: [
      [queue, queueConfig]
    ],

    exchanges: [],

    binds: [
      // listen to all messages from the build exchange
      [queue, 'org.mozilla.exchange.build', 'build.#.finished']
    ]
  });
}

module.exports = buildQueue;
