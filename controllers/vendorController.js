const jwt = require("jsonwebtoken");
const Vendor = require("../models/Vendor");

const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')

dotenv.config()

const secretKey = process.env.whatIsYourName

//http://localhost:4000/vendor/register

const vendorRegister = async (req, res) => {

    const { username, email, password } = req.body;
    try {
        const vendorEmail = await Vendor.findOne({ email })

        if (vendorEmail) {
            return res.status(400).json({ message: "Vendor already exists" })
        }
        console.log("password", password)
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("hashedPassword", hashedPassword)
        const newVendor = new Vendor({
            username, email, password: hashedPassword
        })

        await newVendor.save()
        res.status(201).json({ message: "Vendor registered successfully" })

        // console.log("vendor registered successful")
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong" })
    }
}

//http://localhost:4000/vendor/login
const vendorLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const vendor = await Vendor.findOne({ email })


        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            return res.json({ error: "Invalid username or password" })
        }

        const token = jwt.sign({ vendorId: vendor._id }, secretKey, { expiresIn: "1h" })

        res.status(200).json({ success: "Login Success", token })

        // console.log("email", email)

    } catch (error) {
        res.status(500).json({ error: "user setting error" })

        console.log(error)
    }


}

//http://localhost:4000/vendor/all-vendors

const getAllvendors = async (req, res) => {
    try {
        const vendor = await Vendor.find().populate('firm')
        res.json({ vendor })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ error: "Internal server error" })
    }
}
//http://localhost:4000/vendor/single-vendor/6936b3e55ec3d2bdd938d3f3
const getVendorById = async (req, res) => {
    const VendorId = req.params.id

    try {
        const vendor = await Vendor.findById(VendorId).populate('firm')

        if (!vendor) {
            res.status(400).json({ error: "vendor is not found" })
        }
        res.json({ vendor })
    } catch (error) {
        console.log("error", error)

        res.status(500).json({ error: "Internal server error" })

    }
}

module.exports = { vendorRegister, vendorLogin, getAllvendors ,getVendorById};