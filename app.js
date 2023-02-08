const fs = require('fs')
const http = require('http')
const https = require('https')


const parse_url = (url) => {

  let arr = url.split('/')
  let filename = arr.pop()

  // filenames not support '?' char, so we replace it by '##' string
  filename = filename.replace('?', '##')

  arr.shift()
  let dir = './'
  for (let i = 0; i < arr.length; i++) {
    dir += arr[i] + '/';
  }

  return {dir, filename}
}

const create_directories = (dir) => {

  fs.mkdirSync(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
}

const dump_request = (dir, filename, req) => {

  create_directories(dir)

  const { rawHeaders, url } = req
  const mini_req = { rawHeaders, url }

  fs.writeFileSync(
    dir + filename + '.req',
    stringify(mini_req, null, 2)
  )
}

const download_response = (dir, filename, req, ress) => {

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
      fs.writeFileSync(dir + filename + '.res', chunk, { flag: 'a' })
    })

    res.on("end", () => {
      console.log('http_end')
      req.end()
      const readStream = fs.createReadStream(dir + filename + '.res')
      readStream.pipe(ress)
    })
  })

  req.end()
}

const server = http.createServer((req, res) => {

  const {dir, filename} = parse_url(req.url)
  console.log(`dir: \"${dir}\"`, `filename: \"${filename}\"`) //debug

  dump_request(dir, filename, req)

  download_response(dir, filename, req, res)

})
server.listen(5000)
