// user.js (Model)
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ["User", "Admin"],
      default: "User",
    },
    eventsAttended: [
      {
        event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
        status: {
          type: String,
          enum: ["pending", "confirmed", "cancelled"],
          default: "pending",
        },
        registeredAt: { type: Date, default: Date.now },
        feedbacks: [
          {
            comment: { type: String },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    deleted: { type: Number, default: 0 },
    refreshToken: { type: String },
    passwordChangeAt: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpire: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  next();
});

module.exports = mongoose.model("User", userSchema);