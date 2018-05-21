const http = require('./http')
const Status = require('../schemas/status')
const Request = require('../schemas/request')

class Particle {
  constructor(token) {
    this.token = `access_token=${token}`
    this.base = 'api.particle.io'
    this.version = '/v1'
  }

  devices() {
    const { base, token, version } = this
    return http({
      host: base,
      path: `${version}/devices?${token}`,
    })
  }

  ping(input) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(input)
        .then(id => {
          http({
            host: base,
            path: `${version}/devices/${id}/ping?${token}`,
            method: 'PUT'
          }) .then(data => resolve(data)) .catch(err => reject(err))
        }) .catch(err => reject(err))
    })
  }

  info(input) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(input)
        .then(id => {
          http({
            host: base,
            path: `${version}/devices/${id}?${token}`,
            method: 'GET'
          }) .then(data => resolve(data)) .catch(err => reject(err))
        }) .catch(err => reject(err))
    })
  }

  call(device, name, arg) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(device)
        .then(id => {
          http({
            host: base,
            path: `${version}/devices/${id}/${name}?${token}`,
            method: 'POST',
            data: { arg: arg }
          }).then(data => {
            const value = data.return_value
            updateStatus(device, name, value).then(data => {
              logRequest(device, name, arg, value).then(() => { 
                resolve(data)
              }).catch(err => reject(err))
            }).catch(err => reject(err))
          }) .catch(err => reject(err))
        }) .catch(err => reject(err))
    })
  }

  getDeviceId(input) {
    return new Promise((resolve, reject) => {
      this.devices()
        .then(devices => {
          if (devices instanceof Array) {
            devices.forEach(device => {
              if (device.name === input || device.id === input) {
                resolve(device.id)
                return
              }
            })
            reject({ Error: `Device '${input}' not found` })
          } else {
            reject({ Error: 'No devices not found' })
          }
        }) .catch(err => reject(err))
    })
  }
}

function logRequest(device, name, argument, value){
  const type = name.split('_')[1]
  return new Promise((resolve, reject) =>{
    new Request({
      device,
      name, 
      argument,
      value,
      type,
      date: new Date()
    }).save((err, data) => {
      if(err){
        reject(err)
      }else {
        resolve(data)
      }
    }) 
  })
}

function updateStatus(device, name, status){
  const type = name.split('_')[1]
  return new Promise((resolve, reject) => {
    Status.update({name}, {$set:{name, device, status, type}}, {upsert:true}, (err) => {
      if(err){
        reject(err)
      }else{
        resolve({status})
      }
    })
  })
}

module.exports = Particle
