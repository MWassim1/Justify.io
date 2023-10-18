const mongoose = require('mongoose')

const sch = mongoose.Schema({
    email : {
        type:String,
        required:true
    },
    token : {
        type:String
    },
    words_per_day: {
        type: Number
    }

},{
    timestamps:true
})

module.exports = mongoose.model('users_info',sch)