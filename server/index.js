const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config()
const upload = require('express-fileupload');
// const multer = require('multer'); 
const { S3Client ,PutObjectCommand} = require("@aws-sdk/client-s3");

const bucketName = process.env.BUCKET_NAME
const bucketRegion = process.env.BUCKET_REGION
const accessKey = process.env.ACCESS_KEY
const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3Client({
    region: bucketRegion,

})
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:3000', credentials: true }))


app.use(upload())
// app.use('/uploads', express.static(__dirname + '/uploads'));

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage })
// app.use(upload.single('thumbnail'))

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.get('/', (req, res) => res.send("HomePage"))

app.use(notFound)
app.use(errorHandler)

connect("mongodb+srv://vishnu:iBILGVwF3KCISamD@cluster0.j7gcjcp.mongodb.net/mern-blog-tutorial")
    .then(app.listen(process.env.PORT || 5000, () =>
        console.log(`Server running on port ${process.env.PORT}`)
    ))
    .catch(error => { console.log(error) });
