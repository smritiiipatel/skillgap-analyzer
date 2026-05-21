import express from "express";
import Assessment from "../models/Assessment.js";
import Skill from "../models/Skill.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { skillId, score, feedback } = req.body;

    const assessment = new Assessment({
      userId: req.user.userId,
      skillId,
      score,
      feedback,
    });

    await assessment.save();

    const currentLevel = Math.ceil(score / 20);
    await Skill.findByIdAndUpdate(skillId, { currentLevel });

    res.status(201).json(assessment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.userId })
      .populate("skillId");
    res.json(assessments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
