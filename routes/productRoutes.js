const express=require('express')
const { addProduct, getProductById, deletProductById } = require('../controllers/productController')

const router=express.Router()


router.post("/add-product/:firmId",addProduct);

router.get('/:firmId/products',getProductById)

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.header('Content-Type', 'image/jpeg');
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

router.delete('/:productId',deletProductById)

module.exports=router;