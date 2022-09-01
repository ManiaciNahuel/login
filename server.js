const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const FileStore = require('session-file-store')(session)

const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(session({
    store: new FileStore({path: './sesiones', ttl: 60}),
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}))

/* app.post('/cookies', (req, res) => {
    const { nombre, valor, tiempo} = req.body
    
    if (!nombre || !valor) {
        return res.json("Falta el nombre o el valor")
    }
    if (tiempo) {
        res.cookie(nombre, valor, { signed: true, maxAge: 1000* parseInt(tiempo)})
    } else {
        res.cookie(nombre, valor, { signed: true})
    }
    console.log(nombre, valor, tiempo);
    res.json({proceso: "OK"})
}) */

/* app.get('/cookies', (req, res) => {
    console.log(req.cookies)
    res.json({normales: req.cookies, firmadas: req.signedCookies})
}) */

app.get('/cookiesSessions', (req, res) => {
    if(req.session.contador){
        req.session.contador++
        res.send(`Contador: ${req.session.contador}`)
    } else {
        req.session.contador = 1
        res.send(`BIENVENIDO`)
    }
   /*  res.json({normales: req.cookies, firmadas: req.signedCookies}) */
})


app.get('clearCookies', (req, res) => {
    req.session.destroy( err => {
        if (!err) res.send("Cleared!")
        else res.send({status: "Not cleared - ERROR", body: err})
    })
})

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})