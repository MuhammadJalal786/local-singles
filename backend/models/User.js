const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  firstName:            { type: String, required: true },
  lastName:             { type: String, required: true },
  phone:                { type: String, required: true },
  email:                { type: String, required: true, unique: true },
  sex:                  { type: String, required: true },
  dob:                  { type: Date,   required: true },
  password:             { type: String, required: true },

  subscriptionStatus:   {
    type: String,
    enum: ['inactive','trialing','active'],
    default: 'inactive'
  },
  trialEndsAt:          { type: Date },

  stripeCustomerId:     { type: String },
  stripeSubscriptionId: { type: String }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
