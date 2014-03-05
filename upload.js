var S3_BUCKET = process.env.S3_BUCKET ||
                'gaia-mozilla-b2g-builds';
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

var AWS = require('aws-sdk');
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY
});
var s3 = new AWS.S3();

module.exports = function(fileName, fileData, callback) {
  console.log('Uploading', fileName, AWS.config);
  s3.getObject({Bucket: S3_BUCKET, Key: fileName}, callback);
};
