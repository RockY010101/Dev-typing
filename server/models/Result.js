import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wpm: {
    type: Number,
    required: true
  },
  accuracy: {
    type: Number,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    default: 'JavaScript' // Default or based on state
  },
  difficulty: {
    type: String,
    default: 'easy'
  }
}, {
  timestamps: true
});

const Result = mongoose.model('Result', resultSchema);
export default Result;
