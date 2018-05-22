const mongoose = require('mongoose')

const Status = new mongoose.Schema({
  name  : String,
  status: Number,
  device: String,
  icon  : String,
  floor : String, 
  type  : String, 
  active: Boolean
})


module.exports = mongoose.model('Info', Status)
