const Product = require('../models/Product')

const multer = require('multer');
const path = require('path');
const Firm = require('../models/Firm');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Destination folder where the uploaded images will be stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generating a unique filename
    }
});

const upload = multer({ storage: storage });

//http://localhost:4000/product/add-product/6936b4185ec3d2bdd938d3f8

const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmId;

        const firm = await Firm.findById(firmId)

        if (!firm) {
            return res.status(404).json({ error: "firm are not found" })
        }

        const product = new Product({
            productName, price, category, bestSeller, description, image, firm: firm._id
        })

        const savedProducts = await product.save();

        firm.products.push(savedProducts)
        await firm.save()

        res.status(200).json(savedProducts)

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'internal server error' })
    }
}

//http://localhost:4000/product/6936b4185ec3d2bdd938d3f8/products

const getProductById = async (req, res) => {
    try {
        const firmId = req.params.firmId

        const firm = await Firm.findById(firmId)

        if (!firm) {
            return res.status(404).json({ error: "firm not found" })
        }

        const restaurantName = firm.firmName;
        const product = await Product.find({ firm: firmId });
        res.status(200).json({ restaurantName, product })

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}


const deletProductById = async (req, res) => {
    try {
        const productId = req.params.productId;
        const deletProduct = await Product.findByIdAndDelete(productId)

        if (!deletProduct) {
            return res.status(404).json({ error: "no product found" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" })
    }
}

module.exports = { addProduct: [upload.single('image'), addProduct], getProductById,deletProductById };