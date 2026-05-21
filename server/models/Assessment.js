import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Skill",
    required: true,
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  feedback: {
    type: String,
  },
  assessmentDate: {
    type: Date,
    default: Date.now,
  },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);

export default Assessment;
