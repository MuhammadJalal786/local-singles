// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt   = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  phone:      { type: String, required: true },
  email:      { type: String, required: true, unique: true },
  sex:        { type: String, required: true },
  dob:        { type: Date,   required: true },
  password:   { type: String, required: true },

  isAdmin:    { type: Boolean, default: false },
  subscriptionStatus: {
    type: String,
    enum: ['inactive','trialing','active'],
    default: 'inactive'
  },
  trialEndsAt:          { type: Date },
  stripeCustomerId:     { type: String },
  stripeSubscriptionId: { type: String },

  // Make these optional by removing `required: true`:
  avatar:      { type: String },
  city:        { type: String },            // no longer required
  zip:         { type: String },            // no longer required
  interests:   { type: String },            // no longer required
  occupation:  { type: String },            // no longer required
  bio:         { type: String, maxlength: 1000 }  // no longer required
});

// … (rest of pre-save, comparePassword, etc.) …

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password on login
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
