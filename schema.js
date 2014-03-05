var Schema = require('amqpworkers/schema');
var debug = require('debug')('build queue');

// WHY 8 hours??? That is roughly twice the time between mozilla central builds.
// If we are down for more then 8 hours we don't care about those results
// anyway.
var MESSAGE_TTL_MS =
   // one minute
   (1000 * 60) *
   // one hour
   60 *
   // four hours
   8;

function buildQueue(queue, durable) {
  debug('building schema for: ', queue);

  var queueConfig = {
    messageTtl: MESSAGE_TTL_MS
  };

  if (durable) {
    // durable === never delete this queue
    queueConfig.durable = true;
  } else {
    // not durable means delete this crap as soon as nobody is listening
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
