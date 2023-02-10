const fs = require('fs')
const http = require('http')
const https = require('https')


const parse_url = (url) => {

  let arr = url.split('/')
  arr.pop()
  arr.shift()

  let dir = './'
  for (let i = 0; i < arr.length; i++) {
    dir += arr[i] + '/';
  }

  return dir
}

const make_directories = (dir) => {

  fs.mkdirSync(dir, { recursive: true }, (err) => {
    if (err) throw err;
  })
}

const dump_request = (req) => {

  const { rawHeaders, url } = req
  const mini_req = { rawHeaders, url }

  const dir = parse_url(url)
  make_directories(dir)

  // filenames not support '?' char, so we replace it by '##' string
  const write_path = '.' + url.replace('?', '##')

  fs.writeFileSync(
    write_path + '.req',
    JSON.stringify(mini_req, null, 2)
  )

  return write_path
}

const download_response = (write_path, req, ress) => {

  const options = {
    host: "www.rappi.com.ar",
    port: 443,
    path: req.url,
    method: 'GET',
  }

  var req = https.request(options, (res) => {
    res.setEncoding("utf8");

    res.on("data", (chunk) => {
      console.log('http_data')
      fs.writeFileSync(write_path + '.res', chunk, { flag: 'a' })
    })

    res.on("end", () => {
      console.log('http_end')
      req.end()
      const readStream = fs.createReadStream(write_path + '.res')
      readStream.pipe(ress)
    })
  })

  req.end()
}

const server = http.createServer((req, res) => {

  const {dir, filename} = parse_url(req.url)
  console.log(`dir: \"${dir}\"`, `filename: \"${filename}\"`) //debug

  const write_path = dump_request(dir, filename, req)

  download_response(write_path, req, res)

})
server.listen(5000)
