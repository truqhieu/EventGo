const mongoose = require("mongoose"); // Erase if already required

var eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    endDate: { type: Date },
    location: { type: String, required: true },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    organizerUnit: {
      name: { type: String }, // Tên đơn vị tổ chức
      address: { type: String }, // Địa chỉ của đơn vị tổ chức (tùy chọn)
      contactInfo: {
        phone: { type: String }, // Số điện thoại liên lạc của đơn vị
        email: { type: String }, // Email liên lạc của đơn vị
      },
    },
    // guests: [
    //   {
    //     name: { type: String, required: true },
    //     email: { type: String, required: true },
    //     status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
    //     registeredAt: { type: Date, default: Date.now },
    //   },
    // ], // Người tham gia không có tài khoản
    category: {
      type: String,
      enum: [
        "Technology",
        "Business",
        "Design",
        "Education",
        "Science",
        "Health",
        "Entertainment",
        "Cuisine",
      ],
    },

    views: { type: Number, default: 0 },
    capacity: { type: Number, required: true },
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    backgroundImage: { type: String },
    logoImage: { type: String },
    status: {
      type: String,
      enum: ["Upcoming", "Ongoing", "Completed", "Cancelled"],
      default: "Upcoming",
    },
    feedback: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        feedbackComment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        replies: [
          {
            adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Người trả lời
            replyComment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
          },
        ],
      },
    ],
    sponsors: [{ name: String, logoUrl: String }],
    speaker: [{ type: mongoose.Schema.Types.ObjectId, ref: "Speaker" }],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", eventSchema);
