const Vendor = require('../models/Vendor');

const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')

dotenv.config()

const secretKey = process.env.whatIsYourName




const verifyToken = async (req, res, next) => {

    const token = req.headers.token;
console.log("token",token)
    if (!token) {
        return res.status(401).json({ error: "token is required" })
    }

    try {

        const decoded = jwt.verify(token, secretKey)

        console.log("decoded", decoded)
        const vendor = await Vendor.findById(decoded.vendorId)

        if (!vendor) {
            return res.status(401).json({ error: "vendor is not found" })
        }

        req.vendorId = vendor._id

        next()

    } catch (error) {
        console.error("error", error)
        res.status(500).json({ errror: "invalid token" })
    }
}




module.exports= verifyToken


