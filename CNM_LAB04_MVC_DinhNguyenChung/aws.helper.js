require('dotenv').config()
const AWS = require("aws-sdk");

AWS.config.update({
    region:process.env.REGION,
    accessKeyId:process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRECT_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();
module.exports = {dynamodb};
