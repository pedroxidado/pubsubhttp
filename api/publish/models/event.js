const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
  topic: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Subscriber'
  },
  status: {
      type: String,
      enum: ['success', 'fail'],
      default: 'success'
  },
  reason: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
})

module.exports = mongoose.model('Event', eventSchema)
