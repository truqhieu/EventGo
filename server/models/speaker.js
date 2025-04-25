const mongoose = require("mongoose");

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  photoUrl: { type: String }, // Optional: URL for the speaker's photo
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    twitter: { type: String },
    linkedin: { type: String },
  },
  events: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model("Speaker", speakerSchema);
