const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config()
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


const app = express();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({  origin: 'https://vishnu-mern-blog.vercel.app',credentials: true }))
app.use(upload())
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.get('/', (req,res)=>res.send("HomePage"))

app.use(notFound)
app.use(errorHandler)

connect("mongodb+srv://vishnu:iBILGVwF3KCISamD@cluster0.j7gcjcp.mongodb.net/mern-blog-tutorial")
    .then(app.listen(process.env.PORT || 5000, () =>
        console.log(`Server running on port ${process.env.PORT}`)
    ))
    .catch(error => { console.log(error) });
