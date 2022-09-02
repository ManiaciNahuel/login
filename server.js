const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

//const FileStore = require('session-file-store')(session)
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
const app = express()
app.use(cookieParser())
app.use(express.json())

app.use(session({
    //store: new FileStore({path: './sesiones', ttl: 60}),
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Nahuel_Maniaci:nahue123@cluster0.qvotb9b.mongodb.net/test',
        mongoOptions: advancedOptions
    }),
    
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
}) 
app.get('/cookies', (req, res) => {
    console.log(req.cookies)
    res.json({normales: req.cookies, firmadas: req.signedCookies})
}) */

app.post('/cookiesSessions', (req, res) => {
    let { name } = req.body
    req.session.name = name
    if(req.session.contador){
        req.session.contador++
        res.send(`Contador: ${req.session.contador}`)
    } else {
        req.session.contador = 1
        res.send(`BIENVENIDO ${req.session.name}`)
    }
   /*  res.json({normales: req.cookies, firmadas: req.signedCookies}) */
})


app.get('/clearCookies', (req, res) => {
    req.session.destroy( err => {
        if (!err) res.send("Cleared!")
        else res.send({status: "Not cleared - ERROR", body: err})
    })
})

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})