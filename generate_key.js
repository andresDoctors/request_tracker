const { exec } = require('child_process')


const command =
  'openssl genrsa -out key.pem;'
  + 'openssl req -new -key key.pem -out csr.pem -batch;'
  + 'openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem'

const generate_key = (next) => {
  exec(command, {'shell':'powershell.exe'}, (err, stdout, stderr) => {

    if (err) {
      console.error(err)
  
    } else {
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    }

    if(next) {
      next()}})
}

if (require.main === module) {
  generate_key()
}


module.exports = {generate_key}
