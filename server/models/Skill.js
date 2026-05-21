import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["Technical", "Soft", "Domain", "Tool"],
    required: true,
  },
  currentLevel: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  desiredLevel: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Skill = mongoose.model("Skill", skillSchema);

export default Skill;
