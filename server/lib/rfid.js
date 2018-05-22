const Request   = require('../schemas/request')
const Status   = require('../schemas/status')
class Rfid{
  constructor(){}

  save(device, name, argument, value){
    const date = new Date()
    const type = 'rfid'
    return new Promise((resolve, reject) => {
      new Request({ device, name, argument, date, value, type })
        .save((err, data) => {
          if(err){
            reject(err)
          }else{
            resolve(data)
          }
        })
    })
  }

  update(device, name, status, active){
    const floor = 'roof'
    const type = 'rfid'
    return new Promise((resolve, reject) => {
      Status.update({ name } ,{
        $set: { name, device, status, active, type, floor }
      }, {upsert:true}, (err, data) => {
        if(err){
          reject(err)
        }else {
          resolve(data)
        }
      })
    })
  }
}


module.exports = Rfid
