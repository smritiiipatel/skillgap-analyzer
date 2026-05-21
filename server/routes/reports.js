import express from "express";
import Skill from "../models/Skill.js";
import Assessment from "../models/Assessment.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/gap-analysis", auth, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.userId });

    const report = skills.map((skill) => ({
      skillName: skill.skillName,
      category: skill.category,
      currentLevel: skill.currentLevel,
      desiredLevel: skill.desiredLevel,
      gap: skill.desiredLevel - skill.currentLevel,
      priority: skill.priority,
    }));

    const totalGap = report.reduce((sum, item) => sum + item.gap, 0);
    const avgGap = report.length > 0 ? totalGap / report.length : 0;

    res.json({
      skills: report,
      summary: {
        totalSkills: report.length,
        totalGap,
        averageGap: avgGap.toFixed(2),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/progress", auth, async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.user.userId })
      .populate("skillId")
      .sort({ assessmentDate: -1 });

    const progressData = assessments.map((assessment) => ({
      skillName: assessment.skillId.skillName,
      score: assessment.score,
      date: assessment.assessmentDate,
    }));

    res.json(progressData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
