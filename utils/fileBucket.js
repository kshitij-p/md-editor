const S3 = require('aws-sdk/clients/s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const bucketRegion = process.env.AWS_REGION;

const fileBucket = new S3({
    region: bucketRegion,

})

module.exports = { fileBucket, bucketName, bucketRegion };