import express from "express";
import Skill from "../models/Skill.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Create a new skill
router.post("/", auth, async (req, res) => {
  try {
    const { skillName, category, currentLevel, desiredLevel, priority } = req.body;

    const skill = new Skill({
      userId: req.user.userId,
      skillName,
      category,
      currentLevel,
      desiredLevel,
      priority,
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all skills for user
router.get("/", auth, async (req, res) => {
  try {
    const skills = await Skill.find({ userId: req.user.userId });
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a skill
router.put("/:id", auth, async (req, res) => {
  try {
    let skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(skill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a skill
router.delete("/:id", auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }

    if (skill.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Skill.findByIdAndDelete(req.params.id);
    res.json({ message: "Skill deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
