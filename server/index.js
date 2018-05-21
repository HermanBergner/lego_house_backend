const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.PORT || '8000'
const bodyParser = require('body-parser')
const router = require('./router.js')
const path = require('path')

const cloudUsername = 'root'
const cloudPassword = 'root'
const database      = 'test' 

mongoose.connect(`mongodb://${cloudUsername}:${cloudPassword}@cluster0-shard-00-00-5cnmx.mongodb.net:27017,cluster0-shard-00-01-5cnmx.mongodb.net:27017,cluster0-shard-00-02-5cnmx.mongodb.net:27017/${database}?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin`)

//remove later, this is bad
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  next()
})

app.use(express.static(path.resolve(__dirname, '../public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
  req.io = io
  next()
})

app.use(router)
server.listen(PORT, () => { })


