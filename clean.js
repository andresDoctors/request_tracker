const fs = require('fs')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})


const clean = (next) => {

  const files = fs.readdirSync('./')

  readline.question(`clean? (y/n): `, input => {
    if(input === 'y' && files.includes('dumps')) {
      fs.rm('dumps', {recursive: true, force: true}, () => {
        console.log(`dumps deleted`)})}

    readline.close()
    if(next) {
      next()}})
}

if (require.main === module) {
  clean()
}


module.exports = {clean}
