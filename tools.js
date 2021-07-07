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


function getDate(date=new Date()){

    const day = date.getUTCDate()
    const month = date.getUTCMonth() + 1
    const year = date.getUTCFullYear()

    return `${day}/${month}/${year}`
}


function analyzeURLData(data){
    let history = []

    // Create new array from history sub-documents
    data.forEach(obj => {
        obj.urlVisits.forEach(element => {
            history.push(element)    
        });
    });

    // merge objects with same dates
    var result = history.reduce(function(acc, val){
        var o = acc.filter(function(obj){
            return obj.date==val.date;
        }).pop() || {date:val.date, visits:0};
        
        o.visits += val.visits;
        acc.push(o);
        return acc;
    },[]);

    // Remove duplicates
    var finalresult = result.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
    });

    // Sort results by date
    finalresult.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    });

    return finalresult
}

function analyzeUserData(data){
    let history = []

    data.forEach(obj => {
        obj.urlVisits.forEach(element => {
            history.push(element)    
        });
    });

    // merge objects with same dates
    var result = history.reduce(function(acc, val){
        var o = acc.filter(function(obj){
            return obj.date==val.date;
        }).pop() || {date:val.date, visits:0};
        
        o.visits += val.visits;
        acc.push(o);
        return acc;
    },[]);

    var finalresult = result.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
    });
    console.log(finalresult)
    return finalresult
}
function analyzeUserPerSiteData(data){
    let perSiteVisits = []
    data.forEach(obj => {
        perSiteVisits.push({alias: obj.alias, url: obj.url, totalVisits: obj.totalVisits})    
    });
    console.log(perSiteVisits)
    return perSiteVisits
}
function analyzeUserPerSiteHistoryData(data){
    let history = []

    // Create new object from all relevant history documents
    for (let i = 0; i < data.length; i++) {
        const obj = data[i].urlVisits;
        for (let j = 0; j < obj.length; j++) {
            let element = obj[j]
            history.push({url: data[i].url, alias: data[i].alias, date: element.date, visits: element.visits})    
        }
    }

    // Sort results
    history.sort(function(a,b){
        return new Date(a.date) - new Date(b.date);
    });

    // merge objects with same dates
    var result = history.reduce(function(acc, val){
        var o = acc.filter(function(obj){
            return obj.alias==val.alias;
        }).pop() || {url:val.url, alias:val.alias, visits: []};
        
        o.visits.push({visits: val.visits, date: val.date});
        acc.push(o);
        return acc;
    },[]);

    // filter the results
    var finalresult = result.filter(function(itm, i, a) {
        return i == a.indexOf(itm);
    });

    console.log(finalresult)
    return finalresult
}
module.exports = {
    getCorrectURL,
    getDate,
    analyzeURLData,
    analyzeUserData,
    analyzeUserPerSiteData,
    analyzeUserPerSiteHistoryData
}