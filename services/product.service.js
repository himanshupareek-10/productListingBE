const { Sequelize } = require('sequelize')
const config = require('../config')
const Product = require('../models/products')

const getProducts = async (offset, limit) => {
    const products = await Product.findAll({
        attributes: {
            include: [
                [Sequelize.fn('CONCAT', config.CDN_IMAGE_BASE_URL, Sequelize.col('image_url')), 'image_url']
            ],
            exclude: ['description', 'vendor', 'created_at', 'updated_at']
        },
        offset,
        limit,
        raw: true
    })
    return products
}

const getProductDetails = async (productId) => {
    const productDetails = await Product.findOne({
        where: {
            product_id: productId
        },
        attributes: {
            include: [
                [Sequelize.fn('CONCAT', config.CDN_IMAGE_BASE_URL, Sequelize.col('image_url')), 'image_url']
            ],
            exclude: ['created_at', 'updated_at']
        },
        raw: true
    })
    return productDetails
}

module.exports = {
    getProducts,
    getProductDetails
}