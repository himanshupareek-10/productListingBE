const { Joi } = require('express-validation')

const getProducts = {
    query: Joi.object({
        offset: Joi.number()
            .required(),
        limit: Joi.number()
            .required()
    }).unknown(true)
}

const getProductDetails = {
    params: Joi.object({
        productId: Joi.string().guid({
            version: [
                'uuidv4'
            ]
        }).required()
    }).unknown(true)
}

module.exports = {
    getProducts,
    getProductDetails
}