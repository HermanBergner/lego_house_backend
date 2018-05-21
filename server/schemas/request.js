const mongoose = require('mongoose')

const Request = new mongoose.Schema({
  device: String,
  name: String,
  argument: String,
  date: Date,
  value: String,
  type: String
})


module.exports = mongoose.model('Request', Request)



