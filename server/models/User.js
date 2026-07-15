import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true // Allows nulls to not violate uniqueness before username is set
  },
  googleId: {
    type: String,
    required: true,
    unique: true
  },
  picture: {
    type: String
  },
  name: {
    type: String
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
