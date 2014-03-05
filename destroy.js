var schemaFactory = require('./schema');
var Promise = require('promise');

function destroy(queue, connection) {
  var schema = schemaFactory(queue);
  // destroy the current queue
  return schema.destroy(connection).then(function() {
    console.log('destroyed the queue~!');
    connection.close();
  }).catch(function(err) {
    console.log('Could not connect to pulse!');
    console.log();
    console.error(err.stack);
    process.exit(1);
  });
}

module.exports = destroy;

