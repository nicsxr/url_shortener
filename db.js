const mongoose = require('mongoose')
const dotenv = require('dotenv')
const {Url, User, UrlHistory } = require('./models/models')
const { getDate } = require('./tools')

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

async function insertShortlink(alias, link, secret, ip){
    return new Promise((resolve, reject) => {
        const url = new Url({
            alias: alias,
            url: link,
            secret: secret,
            clicks: 0,
            creator: ip
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
async function addClick(alias, ip='33'){

    // HISTORY
    let history
    // Check if url history record exists, if exists query it, if not create and query it
    if(!await findURLHisotry(alias, ip)){
        history = await createURLHistory(alias, ip)
    }
    else{
        history = await findURLHisotry(alias, ip)
    }

    // check if specific record exists in history, if not create it
    if(!await Url.findOne({alias: alias, 'urlVisits.ip': ip, 'urlVisits': history._id})){
        console.log('xd')
        Url.updateOne({alias: alias}, {$addToSet: {'urlVisits': history._id}}, (err, res) => {
            if(err) console.log(err)
        })
    }
    
    // check if user has already visited today, if not create new sub-record
    if(!await UrlHistory.findOne({_id: history._id, 'urlVisits.date': getDate()})){
        UrlHistory.updateOne({_id: history._id}, {$addToSet: {urlVisits: {/* default values already defined */}}}, (err, res) => {
            if(err) console.log(err)
        })
    }
    
    // increment visits
    UrlHistory.updateOne({_id: history._id, 'urlVisits.date': getDate()}, {$inc: {'urlVisits.$.visits': 1, totalVisits: 1}}, (err, res) => {
        if(err) console.log(err)
    })

    // check if user exists, if not, create
    if (!await findUserByIP(ip))
        await createUser(ip)

    // insert history record in user's collection (if it doesnt already exists)
    User.updateOne({ip: ip}, {$addToSet: {aliasVisits: history._id}, $inc: {totalClicks: 1}}, {upsert: true}, (err, res) => {
        if(err) console.log(err)
    })        

    
    // // check if user has already visited site, if not, create new relation
    // if (!await User.findOne({ip: ip, 'aliasVisits.alias': alias})){
    //     User.updateOne({ip: ip}, {$addToSet: {aliasVisits: {alias: alias}}}, {upsert: true}, (err, res) => {
    //         if(err) console.log(err)
    //     })
    // }
    
    // // // increment visits
    // // User.updateOne({ip: ip, "aliasVisits.alias": alias}, {$inc: {'aliasVisits.$.visits': 1}}, (err, res) => {
    // //     if (err) console.log(err)
    // // })
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

async function createURLHistory(alias, ip){
    return new Promise((resolve, reject) => {
        history = new UrlHistory({
            alias: alias,
            ip: ip
        })
        history.save()
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                console(err)
            })
    })
}

async function findURLHisotry(alias, ip){
    return new Promise((resolve, reject) => {
        UrlHistory.findOne({alias: alias, ip: ip})
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}

async function findURLHistoryByAlias(alias){
    return new Promise((resolve, reject) => {
        UrlHistory.find({alias: alias})
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
    Url.deleteOne({alias: alias}, (err, res) => {
        if(err) console.log(err)
    })
}


module.exports = { 
    findByAlias,
    insertShortlink,
    addClick,
    deleteByAlias,
    findURLHistoryByAlias
}



