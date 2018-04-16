const Particle = require('./lib/particle.js')
const express = require('express')
const router = express.Router()
const async = require('async')
const Light = require('./schemas/light')
const Request = require('./schemas/request')
const particle = new Particle('0885fe851c827803175ecff92dd30aae43fb065b')
const url = require('url')
particle.selected = 'Particle'





router.get('/api', (req, res) => {
  res.sendStatus(418)
})

router.get('/api/devices', (req, res) => {

  particle.devices().then(devices => res.send(devices)).catch(err => res.send(err))
})

router.get('/api/info', (req, res) => {

  res.send({
    Error: 'No building',
    Usage: '/api/info/:building'
  })
})

router.get('/api/info/:building?', (req, res) => {

  const { building } = req.params
  particle.info(building)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})


router.get('/api/ping/:building?', (req, res) => {

  const { building } = req.params
  particle.ping(building)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})


router.post('/api/call', (req, res) => {

  const { name, arg, device } = req.body
  console.log(`request from ${req.ip}`)


  particle.call(device, name, arg)
    .then(data => {
      logRequest({
        name: name,
        argument: arg,
        device: data.id,
        value: data.return_value,
        date: new Date()
      }, req.io)
        .then(() => { res.send(data) })
        .catch(err => res.send({ Error: 'could not save to db' }))
    })
    .catch(err => res.send(err))
})

router.get('/api/history/:limit?', (req, res) => {

  let filter = {}
  try {
    if (req.query.filter)
      filter = req.query.filter

    const limit = parseInt(req.params.limit) || 10
    Request.find(filter, (err, data) => {
      if (err) {
        res.send(err)
      } else {
        data = data.map(d => {
          return {
            name: d.name,
            argument: d.argument,
            date: d.date,
            value: d.value,
            device: d.device
          }
        })
        res.send(data)
      }
    }).limit(limit).sort({ date: -1 });
  } catch (e) {
    res.sendStatus(400)
  }
})



router.post('/api/trigger', (req, res) => {

  console.log('TRIGGER')

  particle.call('building_right', 'baker_light', 'on')
  particle.call('building_right', 'door', 'open')

  setTimeout(() => {
    particle.call('building_right', 'baker_light', 'off')
    particle.call('building_right', 'door', 'close')
  }, 2000)

  res.sendStatus(200)
})

function logRequest(data, io) {
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
        io.emit('call', data)
        resolve(data)
      }
    })
  })
}




module.exports = router
