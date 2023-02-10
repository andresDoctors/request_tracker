const {clean} = require('./clean.js')
const {generate_key} = require('./generate_key.js')
const {get_status} = require('./select_server_protocol.js')


const next1 = () => {
  clean(next2)
}

const next2 = () => {
  let host = process.argv[2]
  host = (!host) ? 'www.rappi.com.ar' : host
  get_status(host, 0)
}

const main = () => {
  generate_key(next1)
}

if (require.main === module) {
    main()
}
