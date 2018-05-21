const https = require('https')
module.exports = function http(o) {

  let options = {}
  let postData = undefined

  if (o.data) {
    postData = JSON.stringify(o.data)
      .replace(/{|}/g, '')
      .replace(/:/g, '=')
      .replace(/"/g, '')
    options = Object.assign({
      method: 'GET',
      host: '',
      path: '',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    }, o)
  } else {
    options = Object.assign({
      method: 'GET',
      host: '',
      path: ''
    }, o)
  }

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        try{
          resolve(JSON.parse(d))
        }catch(e){
          reject(e)
        }
      })
    })

    req.on('error', (e) => {
      reject(e)
    })
    if (postData) {
      req.write(postData)
    }
    req.end()
  })
}
