require('dotenv').config();
console.log('Loaded environment variables:', 
  Object.keys(process.env).reduce((env, key) => {
    env[key] = key.includes('AWS') ? '[REDACTED]' : process.env[key];
    return env;
  }, {})
);

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const AWS = require('aws-sdk');
const fs = require('fs');

const app = express();

app.use(cors());

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('image'), async (req, res) => {
  console.log('Upload route hit');
  
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!process.env.S3_BUCKET_NAME) {
      throw new Error('S3_BUCKET_NAME is not set in environment variables');
    }

    console.log('S3 Bucket Name:', process.env.S3_BUCKET_NAME);

    const fileContent = fs.readFileSync(req.file.path);

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `images/${Date.now()}_${req.file.originalname}`,
      Body: fileContent,
      ContentType: req.file.mimetype,
    };

    console.log('S3 upload params:', s3Params);

    const s3Response = await s3.upload(s3Params).promise();
    console.log('S3 upload successful. Location:', s3Response.Location);

    const rekognitionParams = {
      Image: {
        S3Object: {
          Bucket: process.env.S3_BUCKET_NAME,
          Name: s3Response.Key,
        },
      },
      Attributes: ['ALL'],
    };

    const rekognitionResponse = await rekognition.detectFaces(rekognitionParams).promise();

    console.log('Full Rekognition response:', JSON.stringify(rekognitionResponse, null, 2));

    res.json({
      message: 'Image uploaded and analyzed successfully',
      analysis: rekognitionResponse.FaceDetails,
      imageUrl: s3Response.Location
    });

    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ error: 'Error processing image', details: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});