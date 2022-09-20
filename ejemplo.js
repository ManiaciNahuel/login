const yargs = require('yargs/yargs')(process.argv.slice(2))

const { puerto} = yargs
    .alias({p: 'puerto'})
    .default({puerto: 8080})
    .argv

console.log(puerto);