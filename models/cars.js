const mongoose = require('mongoose');
const schema = mongoose.Schema;
const carSchema = new schema({
  manufactured: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  power: {
    type: Number
  }
}, {
  timestamps: true
});
carSchema.set('toJSON', {
  virtuals: true
})
module.exports = mongoose.model('cars', carSchema)
