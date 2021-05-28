const axios = require('axios')
const db = require('./db')


function urlHasProtocol(url){
    if (url.startsWith('http://') || url.startsWith('https://')){
        return true
    }else{
        return false
    }
}

async function getFullURL(url){
    return new Promise(async (resolve, reject) => {
        try {
            const newUrl = await correctUrl(url)
            db.correctURL(url, newUrl)
            resolve(newUrl)
        } catch (err) {
            const newUrl = 'http://' + url
            db.correctURL(url, newUrl)
            resolve(newUrl)
        }
    })
}

async function correctUrl(url){
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get('http://' + url);
            if (response.startsWith('https')){
                resolve('https://' + url)
            }else{
                resolve('http://' + url)
            }
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    urlHasProtocol,
    getFullURL
}