const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const vendorRoutes = require('./routes/vendorRoutes')
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes')
const path = require('path')

const app = express();
const port = 4000;

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("connected to mongoDB")
    }).catch((err) => {
        console.log(err)
    })
app.use(bodyParser.json())

app.use('/vendor', vendorRoutes)

app.use('/firm', firmRoutes)

app.use('/product',productRoutes)

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log("server running under 4000")
})



app.use('/home', (req, res) => {
    res.send('<h1> welcome to home page')
})