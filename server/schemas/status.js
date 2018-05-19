const mongoose = require('mongoose')

const Status = new mongoose.Schema({
  name: String,
  status: Number,
  device: String
})


module.exports = mongoose.model('Status', Status)
