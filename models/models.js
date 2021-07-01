const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { urlVisitsSchema } = require('./submodels')
const { getCurrentDate } = require('../tools')


const urlSchema = new Schema({
    alias : {
        type: String,
        required: true,
        unique: true
    },
    url : {
        type: String,
        required: true
    },
    secret : {
        type: String,
        required: true
    },
    urlVisits: [],
}, {timestamps: true})

const userSchema = new Schema({
    ip : {
        type: String,
        required: true,
        unique: true
    },
    aliasVisits : [],
    totalClicks : {
        type: Number,
        required: true
    }
}, {timestamps: true})

const urlHistorySchema = new Schema({
    ip : {
        type: String,
        required: true,
    },
    alias : {
        type: String,
        required: true,
    },
    urlVisits: [urlVisitsSchema],
    totalVisits:{
        type: Number,
        default: 0,
        required: true
    },
    date: {
        type: String,
        default: getCurrentDate()
    }
})

const Url = mongoose.model('Url', urlSchema)
const User = mongoose.model('User', userSchema)
const UrlHistory = mongoose.model('UrlHistory', urlHistorySchema)

module.exports = {
    Url,
    User,
    UrlHistory
}