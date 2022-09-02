const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')

//const FileStore = require('session-file-store')(session)
const MongoStore = require('connect-mongo')
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true}
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())

app.use(session({
    //store: new FileStore({path: './sesiones', ttl: 60}),
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Nahuel_Maniaci:nahue123@cluster0.qvotb9b.mongodb.net/test',
        mongoOptions: advancedOptions
    }),
    
    secret: 'secreto',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 100000
    }
}))

app.post('/login', (req, res) => {
    let { name } = req.body
    req.session.name = name
    console.log(req.session);
    res.json(`BIENVENIDO ${req.session.name}`)
})

app.get('/index', (req, res) => {
    if (req.session.name) {
        res.send('Estás logueado')
    } else {
        res.send('No estás logueado')
    }
})


app.get('/logOut', (req, res) => {
    let name = req.session.name
    req.session.destroy( err => {
            if (!err) res.json(`Unlogged! Hasta luego! ${name}`)
            else res.json({status: "Not unlogged - ERROR", body: err})
        })
})

const PORT = 8080
const server = app.listen(PORT, () => {
  console.log(`Servidor en el puerto ${PORT}`);
})