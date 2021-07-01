const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt')
const nanoid = require('nanoid')
const yup = require('yup')
const db = require('./db')
const tools = require('./tools')

require('dotenv').config()

connection = db.connection


const URL_REGEX = /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
let schema = yup.object().shape({
    url: yup.string().required().trim().matches(URL_REGEX, 'Must be a valid URL'),
    alias: yup.string().required().lowercase().matches(/[\w\-]/i),
    secret: yup.string()
})

var app = express()

app.use(express.static('./public'))
app.use(express.json())
app.use(cors())


// Create shortlink
app.post('/create', async (req, res, next) =>{
    let {alias, url, secret} = req.body
    let hashedSecret

    if (!alias) alias = nanoid(6)

    alias = alias.toLowerCase()

    if (secret){
        hash = await bcrypt.hash(secret, 10)
        hashedSecret = hash
    }else{
        secret = nanoid(10)
        const hash = await bcrypt.hash(secret, 10)
        hashedSecret = hash
    }

    try {
        // Validate schema
        await schema.validate({url: url, alias: alias, secret: hashedSecret})
        
        // Check if alias exists
        result = await db.findByAlias(alias)

        // check url and assign HTTP protocol if no protocol is present
        url = tools.getCorrectURL(url)

        // Insert if it doesn't exist
        if (!result){
            result = await db.insertShortlink(alias, url, hashedSecret)
            result['secret'] = secret
            res.send(result)
        }else{
            res.send('Alias already in use! 🚫')
        }

    } catch (error) {
        res.send('Something went wrong 👎 \n Error: ' + error.message)
    }

})

// Visit shortlink URL and redirect
app.get('/:alias', async (req, res) => {
    let { alias } = req.params
    const ip = req.ip.substring(req.ip.lastIndexOf(':')+1) // extract ipv4

    alias = alias.toLowerCase()
    result = await db.findByAlias(alias)
    if (result){
        db.addClick(alias, '33')
        res.status(301).redirect(result.url)
    }else{
        res.status(404).send(`Alias ${alias} not found! 🚫`)
    }
})

// View shortlink URL info
app.get('/info/:alias', async (req, res) => {
    let { alias } = req.params
    alias = alias.toLowerCase()

    result = await db.findByAlias(alias)

    if (result){
        delete result['secret']
        res.send(result)
    }else{
        res.status(404).send(`Alias ${alias} not found! 🚫`)
    }
})

// Update shortlink URL settings
app.post('/delete', async (req, res) => {
    let { alias, secret } = req.body
    alias = alias.toLowerCase()
    
    result = await db.findByAlias(alias)

    if (result){
        correctSecret = await bcrypt.compare(secret, result.secret)
        if (correctSecret){
            db.deleteByAlias(alias)
            res.send(`Shortlink for alias ${alias} delted! 🚮`)
        }else{
            res.send('Incorrect secret! 🔐')
        }
    }else{
        res.status(404).send(`Alias ${alias} not found! 🚫`)
    }

})

app.listen(8000)