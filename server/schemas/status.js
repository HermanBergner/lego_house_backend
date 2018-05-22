const mongoose = require('mongoose')

const Status = new mongoose.Schema({
  name  : String,
  status: Number,
  device: String,
  icon  : String,
  floor : Number, 
  type  : String
})


module.exports = mongoose.model('Info', Status)
