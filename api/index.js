const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// common
const user = require('./user')
// appitem
const appitem = require('./apps')
// overview
const overview = require('./overview')
// notice
const notice = require('./notice')
// salesman
const salesman = require('./salesman')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', user)
app.use('/app', appitem)
app.use('/app/overview', overview)
app.use('/agent/notice', notice)
app.use('/agent/salesman', salesman)

module.exports = app
