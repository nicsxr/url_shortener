const express = require('express')
const cors = require('cors')
const db = require('./db')
const api = require('./api')
const path = require('path')


require('dotenv').config()

connection = db.connection

var app = express()

app.use(express.static('./public'))
app.use(express.json())
app.use(cors())



app.use('/api', api)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    
    app.get(['/create', '/alias', '/user', '/alias/:alias', '/user/:user'], (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

// Visit shortlink URL and redirect
app.get('/:alias', async (req, res) => {
    let { alias } = req.params
    const ip = req.ip.substring(req.ip.lastIndexOf(':')+1) // extract ipv4

    alias = alias.toLowerCase()
    result = await db.findByAlias(alias)
    if (result){
        db.addClick(alias, result.url, ip)
        res.status(301).redirect(result.url)
    }else{
        res.status(404).send(`Alias ${alias} not found! 🚫`)
    }
})

app.listen(8000)