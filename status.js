var Promise = require('promise');

function status(queue, connection) {
  Promise.from(connection.createChannel()).then(function(channel) {
    return channel.checkQueue(queue).then(function(info) {
      console.log(info);
      channel.close();
    });
  }).catch(function(err) {
    console.log('failed to get queue stats');
    console.log(err.stack);
    process.exit(1);
  });
}

module.exports = status;


