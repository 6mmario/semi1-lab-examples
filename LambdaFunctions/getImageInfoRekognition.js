const AWS = require('aws-sdk');
const rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
    //let body = JSON.parse(event.body); // http-api (proxy)
    let body = event; //test y api-rest (sin proxy)

    const bucket = body.bucket;//nombre del bucket
    const photoFilepath = body.photoFilepath;//dirección relativa de la imagen
    
    const params = {
        Image: {
            S3Object: {
                Bucket: bucket,
                Name: photoFilepath
            },
        },
        MaxLabels: 10//cantidad de etiquetas(categorías) que puede devolver
    }
    rekognition.detectLabels(params, function(err, data) {
        if (err) {
            callback(null, {
                statusCode: 500,
                body: err
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ "data": data })
            });
        }
    });
};
