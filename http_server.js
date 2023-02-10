const http = require('http')
const https = require('https')
const express = require("express")
const app = express()


const {dump_request, host_res_handler} = require('./server_utils.js')


const request_options = (host, browser_req) => {
  return {
    host: host,
    port: 443,
    path: browser_req.url,
    method: browser_req.method,
  }
}

const setup = (host) => {

  const server = http.createServer(app)
  server.listen(80)

  app.get('*', (browser_req, server_res) => {
    const write_path = dump_request(browser_req)
    const server_req = https.request(request_options(host, browser_req), (host_res) => {
      host_res_handler(host_res, server_res, write_path)})

    server_req.end()})
}


module.exports = {setup}
