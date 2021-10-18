const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
    accessKeyId:     process.AWS_ACCESS_KEY,
    secretAccessKey: process.AWS_SECRET_ACCESS_KEY,
	region : process.env.REGION
});

const uploadParams = {
         Bucket: process.Bucket, 
         Key: '', // pass key
         Body: null, // pass file body
};

const s3 = {};
s3.s3Client = s3Client;
s3.uploadParams = uploadParams;

module.exports = s3;