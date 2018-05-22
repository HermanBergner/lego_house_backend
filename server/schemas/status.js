const mongoose = require('mongoose')

const Status = new mongoose.Schema({
  name      : String,
  status    : String,
  device    : String,
  icon      : String,
  floor     : String, 
  type      : String, 
  authorized: Boolean
})


module.exports = mongoose.model('Info', Status)
