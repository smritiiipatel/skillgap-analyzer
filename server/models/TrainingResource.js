const mongoose = require('mongoose');

const trainingResourceSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  resourceType: {
    type: String,
    enum: ['Course', 'Video', 'Book', 'Tutorial', 'Workshop'],
    required: true,
  },
  url: String,
  provider: String,
  duration: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TrainingResource', trainingResourceSchema);