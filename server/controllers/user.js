const User = require("../models/user");
const Event = require("../models/event");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { genAccessToken, genRefreshToken } = require("../middlewares/jwt");
const cookie = require("cookie-parser");
const jwt = require('jsonwebtoken')
const sendMail = require("../ultils/sendMail");
const TempRegister = require("../models/tempoRegistation");
const uniqid = require("uniqid");
const sendEmail = require("../ultils/sendMail");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;  
  if (!name || !email || !password) {
    return res.status(409).json({
      success: false,
      mess: "Missing input to create user",
    });
  }
  const currentTime = new Date();
  await TempRegister.deleteMany({
    createdAt: { $lt: new Date(currentTime.getTime() - 3 * 60 * 1000) },
  });

  const existedEmail = await User.findOne({ email: email });
  if (existedEmail) {
    return res.status(409).json({
      success: false,
      mess: "Email has been existed",
    });
  }
  const regisToken = uniqid(); // Tạo token duy nhất
  // console.log("regisToken sendMail",regisToken);
  
  const temRegis = {
    name: name,
    email: email,
    password: password,
    regisToken: regisToken,
  };

  const existedEmailTemp = await TempRegister.findOne({ email: email });

  if (existedEmailTemp) {
    return res.status(409).json({
      success: false,
      mess: "Please verify to register before link expired",
    });
  }
  const html = `Xin chào ${name} ,để hoàn tất quá trình đăng kí tài khoản của bạn, vui lòng ấn vào link sau.Link hết hạn trong 3 phút
  : <a href="${process.env.URL_CLIENT}/finalRegister/${regisToken}">Click here</a>`;

  await sendMail({
    email,
    html,
    subject: "Email Verification",
  });
  await TempRegister.create(temRegis);

  return res.status(200).json({
    success: true,
    mess: "Send Mail to create SuccessFully",
  });
});

const refreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken) {
    return res
      .status(403)
      .json({ success: false, message: "No refresh token in cookie!" });
  }
  const decoded = await jwt.verify(cookie.refreshToken, process.env.REFRESH_SECRETKEY);

  // Kiểm tra `refreshToken` trong cookie so với token trong DB
  const match = await User.findOne({
    _id: decoded._id,
    refreshToken: cookie.refreshToken,
  });

  if (!match) {
    return res.status(403).json({
      success: false,
      newAccessToken: "Refresh token not matched",
    });
  }
  // Tạo Access Token mới
  const newAccessToken = genAccessToken(match._id, match.role);
  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

const finalRegister = asyncHandler(async (req, res) => {
  const { token } = req.params;

  const infoUser = await TempRegister.findOne({
    regisToken: token,
  });

  if (!infoUser) {
    return res.status(400).json({
      success: false,
      mess: "Invalid or expired token",
    });
  }

  // Kiểm tra thời gian hết hạn token
  const currentTime = new Date();
  const tokenExpirationTime = new Date(infoUser.createdAt.getTime() + 24 * 60 * 60 * 1000);

  if (currentTime > tokenExpirationTime) {
    await TempRegister.deleteOne({
      regisToken: token,
    });
    return res.status(400).json({
      success: false,
      mess: "Token has expired",
    });
  }

  // Lưu mật khẩu như nguyên bản
  const user = await User.create({
    name: infoUser?.name,
    email: infoUser?.email,
    password: infoUser?.password, // Lưu mật khẩu không mã hóa
  });

  await TempRegister.deleteOne({
    regisToken: token,
  });

  if (user) {
    return res.status(200).json({
      success: true,
      message: "Account verified successfully!",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "Failed to create user. Please try again.",
    });
  }
});
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      mess: "Please provide email and password",
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "Account does not exist",
    });
  }

  // So sánh mật khẩu trực tiếp
  if (password !== user.password) {
    return res.status(401).json({
      success: false,
      mess: "Incorrect password",
    });
  }

  // Generate tokens
  const accessToken = genAccessToken(user._id, user.role);
  const refreshToken = genRefreshToken(user._id, user.role);

  // Update refreshToken in DB
  await User.findByIdAndUpdate(
    user._id,
    { refreshToken },
    { new: true }
  );

  // Set cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in production
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Remove password before returning user data
  const { password: _, ...userData } = user.toObject();

  return res.status(200).json({
    success: true,
    accessToken,
    userData,
  });
});


const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userData = await User.findById(_id).select("-refreshToken");

  return res.status(200).json({
    success: userData ? true : false,
    mess: userData ? userData : "Can not get data User",
  });
});

const eventRegistration = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { eventId } = req.body;

  const user = await User.findById(_id);
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "User not found",
    });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      success: false,
      mess: "Event not found",
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

  // Nếu sự kiện có tính phí, trả về thông tin QR thanh toán
  if (event.isPaid) {
    const qrCodeUrl = `https://example.com/payment?eventId=${eventId}&userId=${_id}`;
    return res.status(200).json({
      success: true,
      mess: "This event requires payment. Please complete the payment to register.",
      qrCodeUrl,
      price: event.price,
    });
  }

  // Đăng ký sự kiện miễn phí
  user.eventsAttended.push({ event: eventId });
  event.attendees.push(_id);
  await event.save();
  const userRegisted = await user.save();

  // Gửi email thông báo
  const html = `Xin chào ${user?.name}, bạn đã hoàn tất quá trình đăng ký sự kiện ${event?.title}.`;
  await sendEmail({
    email: user?.email,
    html,
    subject: "Đăng ký sự kiện thành công",
  });

  return res.status(200).json({
    success: true,
    mess: "Event registered successfully",
    data: userRegisted,
  });
});

// const cancellEvent = asyncHandler(async (req, res) => {
//   const { eid ,statusEvent} = req.body;
//   const { _id } = req.user;

//   const user = await User.findById(_id);
//   const filterRegisEvent = user?.eventsAttended.filter(
//     (item) => item.event.toString() !== eid
//   );

//   user.eventsAttended = filterRegisEvent;
//   await user.save();

//   return res.status(200).json({
//     success: true,
//     mess: "Hủy thành công",
//   });
// });

// const createUser = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Kiểm tra dữ liệu đầu vào
//         if (!name || !email || !password) {
//             return res.status(409).json({
//                 success: false,
//                 mess: "Missing input to create user"
//             });
//         }

//         // Tạo user
//         const user = await User.create(req.body);

//         return res.status(200).json({
//             success: !!user, // Kiểm tra nếu user tồn tại
//             mess: "Create Successfully"
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             mess: error.message
//         });
//     }
// }
module.exports = {
  createUser,
  refreshToken,
  finalRegister,
  login,
  getCurrent,
  eventRegistration,
  // cancellEvent,
};
