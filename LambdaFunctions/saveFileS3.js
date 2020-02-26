const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-2' });

exports.handler = (event, context, callback) => {
    //let body = JSON.parse(event.body); // http-api (proxy)
    let body = event; //test y api-rest (sin proxy)
    const id = body.id;
    const name = body.name;
    const carnet = body.carnet;

    //Creación del archivo
    const timestamp = Date.now().toString();
    const filename = `archivo-${timestamp}.txt`;
    const content = `${carnet} - ${name}`;

    let buf = Buffer.from(content);
    
    //Parámetros para S3
    const bucketname = 'tet-20160';
    const filepath = filename;
    var paramsS3 = {
        Bucket: bucketname,
        Key: filepath,
        Body: buf,//fileStream,
        ACL: 'public-read',
    };

    s3.upload(paramsS3, function(err, data) {
        if (err) {
            console.log("s3 upload, error");
            callback(null, {
                statusCode: 500,
                body: err
            });
        }
        else {
            console.log("Upload success at:", data.Location);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ "message": "conn end, success" })
            });
        }
    });

};
