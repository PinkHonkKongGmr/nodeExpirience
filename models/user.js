const mongoose = require('mongoose');
const schema = mongoose.Schema;
const userSchema = new schema({
  login: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true,
    unique:true
  }
}, {
  timestamps: true
});
userSchema.set('toJSON', {
  virtuals: true
})
module.exports = mongoose.model('user', userSchema)
