const http = require('http')
const https = require('https')

const protocols = [
  {name: 'http',  port: 80,  __http: http, },
  {name: 'https', port: 443, __http: https,},
]

const new_options = (host, protocol_index) => {

  const options = {
    path: '/',
    method: 'GET',
    host: host,
    port: protocols[protocol_index].port,
  }

  return options
}

const get_status = (host, protocol_index) => {

  const options = new_options(host, protocol_index)

  const __http = protocols[protocol_index].__http
  const req = __http.request(options, (res) => {

    if(res.statusCode === 200) {
      new_server(host, protocol_index)

    } else {
      get_status(host, protocol_index + 1)
    }
  })

  req.end()
}

const new_server = (host, protocol_index) => {

  const {name} = protocols[protocol_index]
  require(`./${name}_server.js`).setup(host)
}

module.exports = {get_status}
