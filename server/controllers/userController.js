import User from '../models/User.js';

// @desc    Auth user & get profile or check if new
// @route   POST /api/users/auth
// @access  Public
export const authUser = async (req, res) => {
  const { email, googleId, picture, name } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        isNewUser: !user.username
      });
    } else {
      user = await User.create({
        name,
        email,
        googleId,
        picture
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        isNewUser: true
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set username
// @route   POST /api/users/username
// @access  Public
export const setUsername = async (req, res) => {
  const { userId, username } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const user = await User.findById(userId);
    if (user) {
      user.username = username;
      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        isNewUser: false
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile (name, username, picture)
// @route   PUT /api/users/:id
// @access  Public
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (req.body.name) user.name = req.body.name;
      
      if (req.body.username && req.body.username !== user.username) {
        const existingUser = await User.findOne({ username: req.body.username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username is already taken' });
        }
        user.username = req.body.username;
      }

      if (req.file) {
        // Convert buffer to base64 string
        const base64Image = req.file.buffer.toString('base64');
        const mimeType = req.file.mimetype;
        user.picture = `data:${mimeType};base64,${base64Image}`;
      }

      await user.save();

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        picture: user.picture,
        isNewUser: !user.username
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
