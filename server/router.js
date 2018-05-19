const Particle = require('./lib/particle.js')
const express = require('express')
const router = express.Router()
const async = require('async')
const Light = require('./schemas/light')
const Request = require('./schemas/request')
const Status = require('./schemas/status')
const particle = new Particle('0885fe851c827803175ecff92dd30aae43fb065b')

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
  console.log(name, arg, device)
  particle.call(device, name, arg, req.io)
    .then((data) =>  res.send(data) )
    .catch(err => res.send(err))
})

router.get('/api/history/:limit?', (req, res) => {

  let filter = {}
  try {
    if (req.query.filter){
      filter = req.query.filter
    }
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

  particle.call('building_right', 'baker_light', 'on', req.io)
  particle.call('building_right', 'door', '180', req.io)

  setTimeout(() => {
    particle.call('building_right', 'baker_light', 'off', req.io)
    particle.call('building_right', 'door', '0', req.io)
  }, 4000)

  res.sendStatus(200)
})




router.get('/api/status/:name?', (req, res) => {
  const { name } = req.params
  Status.find({name: name ? name : /.*/}, (err, data) => {
    if(err) {
      res.send(500)
      return
    }else{
      res.send(data)
    }
  })
})
module.exports = router
