// -*- mode: js; js-indent-level: 2; -*-
'use strict';
const express = require('express');
const mysql = require('mysql');
const fs = require('fs');
const bodyParser = require('body-parser');
var uuid = require('uuid');
const app = express();
//var cors = require('cors');

var AWS = require('aws-sdk');
//AWS.config.loadFromPath('aws_config.json');

//app.use(express.static('web'));
app.use(bodyParser.json({ limit: '5mb', extended: true }));
//app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//app.use(cors());

/*const db_credentials = JSON.parse(fs.readFileSync('db_credentials.json'));
var conn = mysql.createConnection({
  host: db_credentials.host,
  port: db_credentials.port,
  user: db_credentials.user,
  password: db_credentials.password,
  database: db_credentials.database
});*/

let s3_credentials = JSON.parse(fs.readFileSync('s3_credentials.json'));
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  accessKeyId: s3_credentials.accessKeyId,
  secretAccessKey: s3_credentials.secretAccessKey
});

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
  let region = 'us-east-2';
  let folder = 'Gatos gatas/';
  let filepath = `${folder}${filename}`;
  var uploadParamsS3 = {
    Bucket: bucketname,
    Key: filepath,
    Body: decodedImage,
    ACL: 'public-read',
  };

  let filepathAsQueryString = filepath.replace(/\s/g, '+')
  var location = `https://${bucketname}.s3.${region}.amazonaws.com/${filepathAsQueryString}`;
  s3.upload(uploadParamsS3, function sync(err, data) {
    if (err) {
      console.log('Error uploading file:', err);
      res.send({ 'message': 'failed' })
    } else {
      console.log('Upload success at:', location);
      res.send({ 'message': 'uploaded' })
    }
  });
})

