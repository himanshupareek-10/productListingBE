
const express = require('express')
const { validate } = require('express-validation')

const router = express.Router()

const ProductValidations = require('../validations/product.validations')
const ProductCtrl = require('../controllers/product.ctrl')

router.get('/products', validate(ProductValidations.getProducts), ProductCtrl.getProducts)
router.get('/product/:productId', validate(ProductValidations.getProductDetails), ProductCtrl.getProductDetails)

module.exports = router
