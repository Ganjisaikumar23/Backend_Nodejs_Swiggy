const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const vendorRoutes = require('./routes/vendorRoutes')
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes=require('./routes/productRoutes')
const path = require('path')

const app = express();
const PORT = process.env.PORT || 4000;
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

app.listen(PORT, () => {
    console.log(`server started and running at ${PORT}`);
});



app.use('/', (req, res) => {
    res.send('<h1> welcome to home page')
})