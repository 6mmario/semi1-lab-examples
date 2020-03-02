// -*- mode: js; js-indent-level: 2; -*-
'use strict';
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require('body-parser');
var uuid = require('uuid');
const aws_keys = require('./aws_keys');
const app = express();
//var cors = require('cors');

var AWS = require('aws-sdk');
//AWS.config.loadFromPath('aws_config.json');

//app.use(express.static('web'));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//app.use(cors());

const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);

const port = 3000;
app.listen(port, () => {
  let host = 'localhost';
  console.log('Server is listening on http://%s:%s', host, port)
})

app.post('/uploadImageS3', (req, res) => {
  let body = req.body;

  let name = body.name;
  let base64String = body.base64;
  let extension = body.extension;

  //Decodificar imagen
  let encodedImage = base64String;
  let decodedImage = Buffer.from(encodedImage, 'base64');
  let filename = `${name}-${uuid()}.${extension}`;

  //Parámetros para S3
  let bucketname = 'bucket-test-201602822';
  let folder = 'Gatos gatas/';
  let filepath = `${folder}${filename}`;
  var uploadParamsS3 = {
    Bucket: bucketname,
    Key: filepath,
    Body: decodedImage,
    ACL: 'public-read',
  };

  s3.upload(uploadParamsS3, function sync(err, data) {
    if (err) {
      console.log('Error uploading file:', err);
      res.send({ 'message': 'failed' })
    } else {
      console.log('Upload success at:', data.Location);
      res.send({ 'message': 'uploaded' })
    }
  });
})

app.post('/saveImageInfoDDB', (req, res) => {
  let body = req.body;

  let name = body.name;
  let base64String = body.base64;
  let extension = body.extension;

  //Decodificar imagen
  let encodedImage = base64String;
  let decodedImage = Buffer.from(encodedImage, 'base64');
  let filename = `${name}-${uuid()}.${extension}`;

  //Parámetros para S3
  let bucketname = 'bucket-test-201602822';
  let folder = 'usuarios/';
  let filepath = `${folder}${filename}`;
  var uploadParamsS3 = {
    Bucket: bucketname,
    Key: filepath,
    Body: decodedImage,
    ACL: 'public-read',
  };

  s3.upload(uploadParamsS3, function sync(err, data) {
    if (err) {
      console.log('Error uploading file:', err);
      res.send({ 'message': 's3 failed' })
    } else {
      console.log('Upload success at:', data.Location);
      ddb.putItem({
        TableName: "tabla-semi1",
        Item: {
          "id": { S: uuid() },
          "name": { S: name },
          "location": { S: data.Location }
        }
      }, function (err, data) {
        if (err) {
          console.log('Error saving data:', err);
          res.send({ 'message': 'ddb failed' });
        } else {
          console.log('Save success:', data);
          res.send({ 'message': 'ddb success' });
        }
      });
    }
  });
})

