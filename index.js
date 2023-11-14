const config = require('./config')

// NodeJS native modules
const http = require('http')
const cors = require('cors')

// Public Packages
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const { ValidationError } = require('express-validation')

const DB = require('./config/db')
const InitModels = require('./models/init-models')

const connectToDbs = async () => {
    await Promise.all([
        DB.authenticate(),
        InitModels()
    ])
}

(async () => {
    try {
        await connectToDbs()

        const app = express()
        // server middlewares!
        app.enable('trust proxy')
        app.use(bodyParser.json({ limit: '5mb' }))
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(compression())

        app.use(cors(
            {
                origin: '*'
            }
        ))

        app.options('*', (req, res, next) => {
            const origin = req.headers.origin || req.headers.referer
            origin && res.setHeader('Access-Control-Allow-Origin', origin)
            origin && res.header('Access-Control-Allow-Credentials', true)
            origin && res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Origin')
            origin && res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, DELETE')

            if (req.method === 'OPTIONS') {
                return res.end()
            }

            next()
        })

        app.use('/', require('./routes'))

        app.use(function (err, req, res, next) {
            if (err instanceof ValidationError) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
            next();
        })

        app.use('*', (req, res) => {
            res.status(404).end()
        })

        const server = http.createServer(app)
        server.listen(config.PORT, config.HOST, function () {
            console.info(`app started on host: ${config.HOST} and port: ${config.PORT}`)
        })
    } catch (err) {
        console.error(err)
    }
})()
