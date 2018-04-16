const mongoose = require('mongoose')

const Request = new mongoose.Schema({
    device: String,
    name: String,
    argument: String,
    origin: String,
    date: Date,
    value: String
})


module.exports = mongoose.model('Request', Request)



