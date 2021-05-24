const mysql = require('mysql');
const dotenv = require('dotenv')

dotenv.config()

var connection = mysql.createConnection({
    host     : process.env.MYSQL_HOST,
    database : process.env.MYSQL_DATABASE,
    user     : process.env.MYSQL_USER,
    password : process.env.MYSQL_PASSWORD,
});

connection.connect(function(err) {
    if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
    }

    console.log('Connected as id ' + connection.threadId);
});

async function findByAlias(alias){
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM urls WHERE alias LIKE '${alias}'`, (err, row) => {
            if (err) reject(err)
            resolve(row[0])
        })

    })
}

async function insertShortlink(alias, link, secret){
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO urls (alias, url, secret) VALUES ('${alias}', '${link}', '${secret}')`, async (err, row) => {
            if (err) reject(err)
            resolve(await findByAlias(alias))
        })
    })
}

async function addClick(alias){
    connection.query(`UPDATE urls SET clicks = clicks+1 WHERE alias LIKE '${alias}'`, (err, row) => {
        if (err) throw err
    })
}

// UPDATE maybe, maybe not
// async function updateShortlink(old_alias, new_alias, new_url, new_secret){
//     connection.query(`UPDATE urls SET alias='${new_alias}', url='${new_url}', secret='${new_secret}'  WHERE alias LIKE '${old_alias}'`, (err, row) => {
//         if (err) throw err
//     })
// }
async function deleteByAlias(alias){
    connection.query(`DELETE FROM urls WHERE alias='${alias}'`, (err, row) => {
        if (err) throw err
    })
}


module.exports = {
    connection, 
    findByAlias,
    insertShortlink,
    addClick,
    deleteByAlias
}