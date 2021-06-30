const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {Url, User } = require('./models')

dotenv.config()

mongoose.connect(process.env.URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => console.log('Connected'))
    .catch((err) => console.log('Connection Error'))

async function findByAlias(alias){
    return new Promise((resolve, reject) => {
        Url.findOne({alias: alias}, (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

async function insertShortlink(alias, url, secret){
    return new Promise((resolve, reject) => {
        const url = new Url({
            alias: alias,
            url: url,
            secret: secret,
            clicks: 0
        })

        url.save()
            .then((res) => {
                resolve(res)
            })
            .catch((err) =>{
                reject(err)
            })
    })
}
//addclick
async function addClick(alias){
    const url = await findByAlias(alias)
    url.clicks = url.clicks+1
    url.save()

    // check if user exists, if not, create
    if (!findUserByIP('33'))
        await createUser('33')
    
    // check if user has already visited site, if not, create new relation
    if (!User.findOne({'ip:': '33', 'aliasVisits.alias': alias}))
        User.updateOne({ip: "33"}, {$addToSet: {aliasVisits: {alias: alias}}}, (err, res) => {
            if(err) console.log(err)
        })
    
    // increment visits
    User.updateOne({ip: "33", "aliasVisits.alias": alias}, {$inc: {'aliasVisits.$.visits': 1}}, (err, res) => {
        if (err) console.log(err)
    })
}   

async function findUserByIP(ip){
    return new Promise((resolve, reject) => {
        User.findOne({ip: ip}, (err, res) => {
            if (err) reject(err)
            resolve(res)
        })
    })
}

async function createUser(ip){
    return new Promise((resolve, reject) => {
        user = new User({
            ip: ip,
            aliasVisits: [],
            totalClicks: 0
        })
        user.save()
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
// UPDATE maybe, maybe not
// async function updateShortlink(old_alias, new_alias, new_url, new_secret){
//     connection.query(`UPDATE url SET alias='${new_alias}', url='${new_url}', secret='${new_secret}'  WHERE alias LIKE '${old_alias}'`, (err, row) => {
//         if (err) throw err
//     })
// }
async function deleteByAlias(alias){
    connection.query(`DELETE FROM url WHERE alias='${alias}'`, (err, row) => {
        if (err) throw err
    })
}


module.exports = { 
    findByAlias,
    insertShortlink,
    addClick,
    deleteByAlias
}



