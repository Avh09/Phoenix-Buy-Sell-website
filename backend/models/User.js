const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String, required: true,
  },
  lastName: {
    type: String, required: true,
  },
  email: {
    type: String, required: true, unique: true,
    validate: {
      validator: function(v) {
        return /^[a-zA-Z0-9._%+-]+@iiit\.ac\.in$/.test(v);
      },
      message: 'Only IIIT email addresses are allowed!'
    }
  },
  age: {
    type: Number, required: true
  },
  contactNumber: {
    type: String, required: true
  },
  password: {
    type: String,required: true
  },
  sellerReviews: [{
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    rating: Number, comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);