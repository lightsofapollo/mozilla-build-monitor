var schemaFactory = require('./schema');
var Consumer = require('./consumer');
var Promise = require('promise');
var debug = require('debug')('consumer');

function worker(queue, connection) {
  debug('start worker');
  // assert queue and define it
  var schema = schemaFactory(queue);
  schema.define(connection).then(function() {
    debug('got connection!');
    // consume the queue
    var consumer = new Consumer(connection);
    return consumer.consume(queue, {
      // setting a prefetch limits the number of messages that will be given to
      // this process concurrently.
      prefetch: 100
    });
  }).catch(function(err) {
    console.log('Error in worker!');
    console.log();
    console.error(err.stack);
    process.exit(1);
  });
}

module.exports = worker;
