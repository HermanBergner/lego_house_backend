const mongoose = require('mongoose')

const Light = new mongoose.Schema({
    name: String, 
    date: Date, 
    origin: String,
    gateway: String,
    status: Boolean
})


module.exports = mongoose.model('Light', Light)



