// backend/models/Event.js
const mongoose = require('mongoose');

const attendeeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  title:          { type: String,  required: true },
  description:    { type: String,  required: true },
  date:           { type: Date,    required: true },   // Start date/time
  startTime:    { type: String, required: true },                       
  address:      { type: String, required: true },
  minAge:         { type: Number,  required: true },
  maxAge:         { type: Number,  required: true },
  image:          { type: String },                     // URL for hero image
  capacity:       { type: Number,  required: true },
  attendees:      [attendeeSchema],                      // Now subdocs instead of bare IDs
  price:          { type: Number,   },    // e.g. ticket price in USD
  type:           { type: String,  required: true },    // e.g. "Party", "Concert", etc.
  discount:       { type: Number,  default: 0 },        // e.g. percentage discount
  coupleAllowed:  { type: Boolean, default: false },    // Whether couples can attend
  createdAt:      { type: Date,    default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
