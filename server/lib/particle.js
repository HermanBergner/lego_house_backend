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
      path: `/v1/devices?${token}`,
    })
  }

  ping(input) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(input)
        .then(id => {
          http({
            host: base,
            path: `/v1/devices/${id}/ping?${token}`,
            method: 'PUT'
          })
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  info(input) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(input)
        .then(id => {
          http({
            host: base,
            path: `/v1/devices/${id}?${token}`,
            method: 'GET'
          })
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
        .catch(err => reject(err))
    })
  }

  call(device, name, arg, io) {
    const { base, token, version } = this
    return new Promise((resolve, reject) => {
      this.getDeviceId(device)
        .then(id => {
          http({
            host: base,
            path: `/v1/devices/${id}/${name}?${token}`,
            method: 'POST',
            data: { arg: arg }
          }).then(data => {
            updateStatus(device, name, data.return_value).then(data => resolve(data)).catch(err => reject(err))
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
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = Particle

function updateStatus(device, name, status){
  const type = name.split("_")[1]
  return new Promise((resolve, reject) => {
    Status.update({name}, {$set:{name, device, status, type}}, {upsert:true}, (err, data) => {
      if(err){
        reject(err)
      }else{
        resolve({status})
      }
    })
  })
}

function logRequest(data) { 
  return new Promise((resolve, reject) => {
    const upload = new Request({
      name: new String(data.name) || undefined,
      argument: new String(data.argument) || undefined,
      date: new String(data.date),
      value: new String(data.value) || undefined,
      device: new String(data.device) || undefined,
    })

    upload.save((err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}
