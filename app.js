const {setup} = require('./http_server')
const {clean} = require('./clean.js')


if (require.main === module) {
  clean()
  let host = process.argv[2]
  host = (!host) ? 'www.rappi.com.ar' : host
  setup(host)
}
