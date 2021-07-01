const axios = require('axios')
const db = require('./db')


function getCorrectURL(url){
    if (!url.startsWith('http://') && !url.startsWith('https://')){
        console.log(url.startsWith('https://'))
        return 'http://' + url
    }else{
        return url
    }
}

// not working properly
// async function getFullURL(url){
//     return new Promise(async (resolve, reject) => {
//         try {
//             const newUrl = await correctUrl(url)
//             resolve(newUrl)
//         } catch (err) {
//             const newUrl = 'http://' + url
//             resolve(newUrl)
//         }
//     })
// }

// async function correctUrl(url){
//     return new Promise(async (resolve, reject) => {
//         try {
//             const response = await axios.get('http://' + url);
//             console.log(response)
//             if (response.startsWith('https')){
//                 resolve('https://' + url)
//             }else{
//                 resolve('http://' + url)
//             }
//         } catch (err) {
//             reject(err)
//         }
//     })
// }


function getCurrentDate(){
    const date = new Date()

    const day = date.getUTCDate()
    const month = date.getUTCMonth()
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}`
}

module.exports = {
    getCorrectURL,
    getCurrentDate
}