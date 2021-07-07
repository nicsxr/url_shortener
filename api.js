const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const nanoid = require('nanoid')
const yup = require('yup')
const db = require('./db')
const tools = require('./tools')

require('dotenv').config()


// needs to be moved
const handleErrorAsync = func => async (req, res, next) => {
    try {
        await func(req, res, next);
    } catch (error) {
        next(error);
    }
};

// also need to be moved
const URL_REGEX = /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/
let schema = yup.object().shape({
    url: yup.string().required().trim().matches(URL_REGEX, 'Must be a valid URL'),
    alias: yup.string().required().lowercase().matches(/[\w\-]/i),
    secret: yup.string()
})

// Create shortlink
router.post('/create', async (req, res) =>{
    let {alias, url, secret} = req.body
    const ip = req.ip.substring(req.ip.lastIndexOf(':')+1) // extract ipv4
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
            result = await db.insertShortlink(alias, url, hashedSecret, ip)
            result['secret'] = secret
            res.status(201).send(result)
        }else{
            res.send('Alias already in use! 🚫')
        }

    } catch (error) {
        res.send('Something went wrong 👎 \n Error: ' + error.message)
    }

})

// View shortlink URL info
router.get('/info/url/:alias', handleErrorAsync(async (req, res, next) => {
    let { alias } = req.params
    alias = alias.toLowerCase()
    
    result = await db.findByAlias(alias)

    console.log(result)
    
    urlHistory = await db.findURLHistoryByAlias(alias)
    analyzedResult = tools.analyzeURLData(urlHistory)

    urlInfo = {
        alias: result.alias,
        url: result.url,
        createdAt: tools.getDate(result.createdAt),
        totalVisits: analyzedResult.reduce((a, b) => +a + +b.visits, 0)
    }

    analyzedResult.splice(0,0, urlInfo)
    console.log(analyzedResult)
    if (result){
        res.send(analyzedResult)
    }else{
        res.status(404)
    }
}))

// View shortlink URL info
router.get('/info/user/:ip', handleErrorAsync(async (req, res, next) => {
    let { ip } = req.params

    result = await db.findUserByIP(ip)

    userHistory = await db.findUserHistoryByIP(ip)

    fullHistory = tools.analyzeUserData(userHistory)
    perSiteData = tools.analyzeUserPerSiteData(userHistory)
    perSiteHistory = tools.analyzeUserPerSiteHistoryData(userHistory)

    userInfo = {
        ip: result.ip,
        createdAt: tools.getDate(result.createdAt),
        totalVisits: userHistory.reduce((a, b) => +a + +b.totalVisits, 0)
    }

    finalResult = {
        userInfo,
        fullHistory,
        perSiteData,
        perSiteHistory
    }

    // console.log(finalResult)
    if (result){
        res.send(finalResult)
    }else{
        res.status(404).send(`User ${ip} not found! 🚫`)
    }
}))

// Update shortlink URL settings
router.post('/delete', async (req, res) => {
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


module.exports = router