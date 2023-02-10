const fs = require('fs')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
})


const clean = () => {

  const files = fs.readdirSync('./')

  readline.question(`clean? (y/n): `, input => {
    if(input === 'y' && files.includes('dumps')) {
      fs.rm('dumps', {recursive: true, force: true}, () => {
        console.log(`dumps deleted`)})}

    readline.close()})
}

if (require.main === module) {
  clean()
}


module.exports = {clean}
