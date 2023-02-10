const fs = require('fs')


const parse_url = (url) => {

  let arr = url.split('/')
  arr.pop()
  arr.shift()

  let dir = './dumps/'
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

const dump_request = (browser_req) => {

  const { rawHeaders, url } = browser_req
  const mini_req = { rawHeaders, url }

  const dir = parse_url(url)
  make_directories(dir)

  // filenames not support '?' char, so we replace it by '##' string
  const write_path = './dumps/' + url.replace('?', '##')

  fs.writeFileSync(
    write_path + '.req',
    JSON.stringify(mini_req, null, 2)
  )

  return write_path
}

const host_res_handler = (host_res, server_res, write_path) => {

  host_res.setEncoding("utf8")

  host_res

    .on("data", (chunk) => {
      fs.writeFileSync(write_path + '.data' + '.res', chunk, { flag: 'a' })})

    .on("readable", () => {
      let chunk;
      while (null !== (chunk = host_res.read())) {
        fs.writeFileSync(write_path + '.readable' + '.res', chunk, { flag: 'a' })}})

    .on("end", () => {
      if (fs.existsSync(write_path + '.data' + '.res')) {
        const readStream = fs.createReadStream(write_path + '.data' + '.res')
        readStream.pipe(server_res)}})

    .on("close", () => {})

    .on("error", (err) => {})

}


module.exports = {dump_request, host_res_handler}