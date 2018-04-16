const express = require('express')
const app = express()
const mongoose = require('mongoose')
const server = require('http').Server(app)
const io = require('socket.io')(server)
const PORT = process.env.port || '8000'
const HOST = process.env.host || '0.0.0.0'
const bodyParser = require('body-parser')
const router = require('./router.js')
const path = require('path')
const Particle = require('./lib/particle')
const particle = new Particle('0885fe851c827803175ecff92dd30aae43fb065b')
var request = require('request');


mongoose.connect('mongodb://localhost/backend')

//remove later, this is bad
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

app.use(express.static(path.resolve(__dirname, '../public')))
app.use(bodyParser.json())
app.use(router)




server.listen(PORT, HOST, () => {
  startSocket()
})





function startSocket() {
  io.on('connection', (socket) => {

    //updateHistory(socket)

  })
}


function updateHistory(socket) {
  request.post('http://localhost:8000/api/history', (err, data) => {
    if (err) {
      console.log(err)
    } else {
      socket.emit('history', data.body)
      //setTimeout(() => updateHistory(history), 10 * 1000)
    }
  })
}
