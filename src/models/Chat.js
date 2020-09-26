// Cómo se van a visualizar los mensajes

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ChatSchema = new Schema({ // Se define el Schema
    nick: String,
    msg: String,
    created_at: {
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Chat', ChatSchema); // Se exporta el Schema