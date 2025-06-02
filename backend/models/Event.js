const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  date:         { type: Date,   required: true },
  zip:          { type: String, required: true },
  city:         { type: String, required: true },
  minAge:       { type: Number, required: true },
  maxAge:       { type: Number, required: true },
  image:        { type: String },             // cover image URL
  capacity:     { type: Number, required: true },
  attendees:   [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
