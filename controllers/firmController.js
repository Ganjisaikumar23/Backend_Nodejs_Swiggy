const Firm = require('../models/Firm');

const Vendor = require('../models/Vendor')

const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

//http://localhost:4000/firm/add-firm

const addFirm = async (req, res) => {
    try {

        const { firmName, area, category, region, offer } = req.body;

        const image = req.file ? req.file.filename : undefined;

        const vendor = await Vendor.findById(req.vendorId)

        if (!vendor) {
            res.status(404).json({ message: "vendor is not found" })
        }

        const firm = new Firm({
            firmName, area, category, region, offer, image, vendor: vendor._id
        })

        const saveFirm = await firm.save()

        vendor.firm.push(saveFirm)

        await vendor.save()

        res.status(200).json({ message: "firm added success fully" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'internal server error' })

    }
}

const deletFirmById = async (req, res) => {
    try {
        const firmId = req.params.firmId;
        const deletProduct = await Firm.findByIdAndDelete(firmId)

        if (!deletProduct) {
            return res.status(404).json({ error: "no product found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { addFirm: [upload.single('image'), addFirm],deletFirmById }