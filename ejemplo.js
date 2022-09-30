const yargs = require('yargs/yargs')(process.argv.slice(2))
const { fork } = require('child_process')


const argv = yargs
    .option('p', {
        alias: 'puerto',
        default: 8080
    })
    .option('m', {
        alias: 'mode',
        default: 'FORK',
        type: "string"
    })
    .argv
let args;
console.log(argv);

if (process.argv.slice(2).length === 0) {
    args = "Sin argumentos";
} else {
    args = process.argv.slice(2);
}

const info = [
    args, 
    process.platform, 
    process.version, 
    process.memoryUsage().rss, 
    process.argv[0], 
    process.pid, 
    process.cwd(), 
];
console.log(info);

const express = require('express')
const app =  express()

app.get('/api/random', (req, res) => {
    const { cant } = req.query;
	const forked = fork("./random.js");
	forked.send({ msg: "start", cant });
	forked.on("message", (msg) => {
		res.json({ msg });
	});
})


const PORT =  8080
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
  })
server.on("error", error => console.log(`Error en servidor: ${error}`))