const asyncHandler = require('express-async-handler'); // Thêm dòng này
const User = require('../models/user'); // Import model User
const Event = require('../models/event'); // Import model Event
const sendEmail = require('../ultils/sendMail'); // Import hàm gửi email

const handlePayment = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.body;

  const user = await User.findById(userId);
  const event = await Event.findById(eventId);

  if (!user || !event) {
    return res.status(404).json({
      success: false,
      mess: "User or Event not found",
    });
  }

  // Kiểm tra nếu sự kiện đã đăng ký
  const eventRegisted = user.eventsAttended.find(
    (el) => el?.event.toString() === eventId
  );
  if (eventRegisted) {
    return res.status(400).json({
      success: false,
      mess: "You have already registered for this event",
    });
  }

  // Xử lý thanh toán (giả lập)
  const paymentSuccess = true; // Thay bằng logic thanh toán thực tế
  if (!paymentSuccess) {
    return res.status(400).json({
      success: false,
      mess: "Payment failed",
    });
  }

  // Cập nhật trạng thái đăng ký
  user.eventsAttended.push({ event: eventId });
  event.attendees.push(userId);
  await user.save();
  await event.save();

  // Gửi email thông báo
  const html = `Xin chào ${user?.name}, bạn đã hoàn tất thanh toán và đăng ký sự kiện ${event?.title}.`;
  await sendEmail({
    email: user?.email,
    html,
    subject: "Thanh toán thành công",
  });

  return res.status(200).json({
    success: true,
    mess: "Payment successful and event registered",
  });
});

module.exports = { handlePayment };