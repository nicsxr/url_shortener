const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { getDate } = require('../tools')


const urlVisitsSchema = new Schema({
    date: {
        type: String,
        default: getDate()
    },
    visits:{
        type: Number,
        default: 0
    }
})

// const userVisitsSchema = new Schema({
//     alias: {
//         type: String,
//         required: true
//     },
//     visits: {
//         type: Number,
//         required: true,
//         default: 0
//     },
// }, {_id: false, timestamps: true})


// const urlVisitsSchema = new Schema({
//     ip: {
//         type: String,
//         required: true
//     },
//     visits: {
//         type: Number,
//         required: true,
//         default: 0
//     },
//     history: []
// }, {_id: false, timestamps: true})

module.exports = {
    urlVisitsSchema
}