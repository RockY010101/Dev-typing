import Result from '../models/Result.js';

// @desc    Create new result
// @route   POST /api/results
// @access  Public
export const createResult = async (req, res) => {
  const { userId, wpm, accuracy, errors, timeTaken, language, difficulty } = req.body;

  try {
    const result = new Result({
      user: userId,
      wpm,
      accuracy,
      errors: errors || 0,
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

// @desc    Get leaderboard for a difficulty
// @route   GET /api/results/leaderboard?difficulty=easy&userId=<id>
// @access  Public
export const getLeaderboard = async (req, res) => {
  const { difficulty = 'easy', userId } = req.query;

  try {
    // Get all valid results for this difficulty (accuracy >= 90)
    const allResults = await Result.find({
      difficulty,
      accuracy: { $gte: 90 }
    }).populate('user', 'username picture');

    // Group by user, keeping only the best result per user
    // Best = highest WPM, tie-broken by lowest timeTaken
    const bestByUser = {};
    for (const result of allResults) {
      if (!result.user) continue; // skip orphaned results
      const uid = result.user._id.toString();
      const existing = bestByUser[uid];
      if (
        !existing ||
        result.wpm > existing.wpm ||
        (result.wpm === existing.wpm && result.timeTaken < existing.timeTaken)
      ) {
        bestByUser[uid] = result;
      }
    }

    // Sort all best results: WPM desc, timeTaken asc
    const sorted = Object.values(bestByUser).sort((a, b) => {
      if (b.wpm !== a.wpm) return b.wpm - a.wpm;
      return a.timeTaken - b.timeTaken;
    });

    // Build top 10
    const top10 = sorted.slice(0, 10).map((r, i) => ({
      rank: i + 1,
      userId: r.user._id,
      username: r.user.username || 'Anonymous',
      picture: r.user.picture || '',
      language: r.language,
      wpm: r.wpm,
      accuracy: r.accuracy,
      timeTaken: r.timeTaken
    }));

    // Compute current user's rank if they are outside top 10
    let userRank = null;
    if (userId) {
      const userInTop10 = top10.find(e => e.userId.toString() === userId);
      if (!userInTop10) {
        const userIdx = sorted.findIndex(r => r.user._id.toString() === userId);
        if (userIdx !== -1) {
          const r = sorted[userIdx];
          userRank = {
            rank: userIdx + 1,
            userId: r.user._id,
            username: r.user.username || 'Anonymous',
            picture: r.user.picture || '',
            language: r.language,
            wpm: r.wpm,
            accuracy: r.accuracy,
            timeTaken: r.timeTaken
          };
        }
      }
    }

    res.json({ top10, userRank });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
