const mongoose = require('mongoose')
const Schema = mongoose.Schema

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
    clicks : {
        type: Number,
        required: true,
        default: 0
    }
}, {timestamps: true})

const aliasVisitsSchema = new Schema({
    alias: {
        type: String,
        required: true
    },
    visits: {
        type: Number,
        required: true,
        default: 0
    }
}, {_id: false})
const userSchema = new Schema({
    ip : {
        type: String,
        required: true,
        unique: true
    },
    aliasVisits : [aliasVisitsSchema],
    totalClicks : {
        type: Number,
        required: true
    }
}, {timestamps: true})

const Url = mongoose.model('Url', urlSchema)
const User = mongoose.model('User', userSchema)

module.exports = {
    Url,
    User
}