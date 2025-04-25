const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người nhận thông báo
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false }, // Sự kiện liên quan (nếu có)
  message: { type: String, required: true }, // Nội dung thông báo
  type: { type: String, enum: ['event_update', 'reminder', 'registration', 'cancellation'], required: true }, // Loại thông báo
  read: { type: Boolean, default: false }, // Trạng thái đã đọc hay chưa
  createdAt: { type: Date, default: Date.now } // Thời gian tạo thông báo
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { Notification };
