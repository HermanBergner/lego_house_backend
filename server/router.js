const Particle  = require('./lib/particle.js')
const express   = require('express')
const router    = express.Router()
const Request   = require('./schemas/request')
const Status    = require('./schemas/status')
const Rfid      = require ('./lib/rfid')
const particle  = new Particle('0885fe851c827803175ecff92dd30aae43fb065b')

router.get('/api', (req, res) => {

  res.sendStatus(418)
})

router.get('/api/devices', (req, res) => {

  particle.devices().then(devices => res.send(devices)).catch(err => res.send(err))
})

router.get('/api/info', (req, res) => {
  res.send({ Error: 'No building', Usage: '/api/info/:building' })
})

router.get('/api/info/:building?', (req, res) => {

  const { building } = req.params
  particle
    .info(building)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})


router.get('/api/ping/:building?', (req, res) => {

  const { building } = req.params
  particle
    .ping(building)
    .then(data => res.send(data))
    .catch(err => res.send(err))
})

router.post('/api/call', (req, res) => {

  const { name, arg, device } = req.body
  particle
    .call(device, name, arg, req.io)
    .then((data) =>  res.send(data))
    .catch(err => res.send(err))
})

router.get('/api/history/:limit?', (req, res) => {

  let filter = {}
  try {
    if (req.query.filter){ filter = req.query.filter }
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
    }).limit(limit).sort({ date: -1 })
  } catch (e) { res.sendStatus(400) }
})



router.post('/api/trigger', (req, res) => {
  const { data } = req.body 
  const rfid = new Rfid()
  particle.call('building_right', 'baker_light', 'on', req.io)
  particle.call('building_right', 'baker_door', '180', req.io)

  rfid.save('building_middle', 'rfid','read', data)
  rfid.update('building_middle', 'rfid', data,  true)

  setTimeout(() => {
    particle.call('building_right', 'baker_light', 'off', req.io)
    particle.call('building_right', 'baker_door', '0', req.io)

    rfid.save('building_middle', 'rfid','read', data)
    rfid.update('building_middle', 'rfid', data,  false)
  }, 30 * 1000)

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

router.get('/api/good_night', (req, res) => {

  particle.call('building_right', 'baker_light', 'off', req.io)
  particle.call('building_right', 'dent_light', 'off', req.io)
  particle.call('building_right', 'family_light', 'off', req.io)
  particle.call('building_right', 'baker_door', '0', req.io)

  particle.call('building_middle', 'flower_light', 'off', req.io)
  particle.call('building_middle', 'photo_light', 'off', req.io)

  particle.call('building_left', 'pixel_light', 'off', req.io)
  particle.call('building_left', 'baller_light', 'off', req.io)
  particle.call('building_left', 'music_light', 'off', req.io)
  particle.call('building_left', 'cafe_door', '0', req.io)

  res.sendStatus(200)
})

router.get('/api/good_morning', (req, res) => {

  particle.call('building_right', 'baker_light', 'on', req.io)
  particle.call('building_right', 'dent_light', 'on', req.io)
  particle.call('building_right', 'family_light', 'on', req.io)
  particle.call('building_right', 'baker_door', '0', req.io)

  particle.call('building_middle', 'flower_light', 'on', req.io)
  particle.call('building_middle', 'photo_light', 'on', req.io)

  particle.call('building_left', 'pixel_light', 'on', req.io)
  particle.call('building_left', 'baller_light', 'on', req.io)
  particle.call('building_left', 'music_light', 'on', req.io)
  particle.call('building_left', 'cafe_door', '0', req.io)

  res.sendStatus(200)
})
module.exports = router
