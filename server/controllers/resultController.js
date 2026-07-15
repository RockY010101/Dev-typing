import Result from '../models/Result.js';

// @desc    Create new result
// @route   POST /api/results
// @access  Public
export const createResult = async (req, res) => {
  const { userId, wpm, accuracy, timeTaken, language, difficulty } = req.body;

  try {
    const result = new Result({
      user: userId,
      wpm,
      accuracy,
      timeTaken,
      language,
      difficulty
    });

    const createdResult = await result.save();
    res.status(201).json(createdResult);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user results
// @route   GET /api/results/user/:id
// @access  Public
export const getUserResults = async (req, res) => {
  try {
    const results = await Result.find({ user: req.params.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a result
// @route   DELETE /api/results/:id
// @access  Public
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    await result.deleteOne();
    res.json({ message: 'Result removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
