// server/controllers/user.js
const User = require("../models/user");
const Event = require("../models/event");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { genAccessToken, genRefreshToken } = require("../middlewares/jwt");
const jwt = require("jsonwebtoken");
const sendMail = require("../ultils/sendMail");
const TempRegister = require("../models/tempoRegistation");
const uniqid = require("uniqid");

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
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
  const regisToken = uniqid();

  const temRegis = {
    name: name,
    email: email,
    phone: "",
    address: "",
    password: password,
    regisToken: regisToken,
    role: role || "User",
  };

  const existedEmailTemp = await TempRegister.findOne({ email: email });

  if (existedEmailTemp) {
    return res.status(409).json({
      success: false,
      mess: "Please verify to register before link expired",
    });
  }
  const html = `Xin chào ${name}, để hoàn tất quá trình đăng ký tài khoản của bạn, vui lòng ấn vào link sau. Link hết hạn trong 3 phút: <a href="${process.env.URL_CLIENT}/finalRegister/${regisToken}">Click here</a>`;

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

//  refreshToken
const refreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;

  if (!cookie || !cookie.refreshToken) {
    return res
      .status(403)
      .json({ success: false, message: "No refresh token in cookie!" });
  }
  const decoded = await jwt.verify(
    cookie.refreshToken,
    process.env.REFRESH_SECRETKEY
  );

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

  const newAccessToken = genAccessToken(match._id, match.role);
  return res.status(200).json({
    success: true,
    accessToken: newAccessToken,
  });
});

//  finalRegister
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

  const currentTime = new Date();
  const tokenExpirationTime = new Date(
    infoUser.createdAt.getTime() + 24 * 60 * 60 * 1000
  );

  if (currentTime > tokenExpirationTime) {
    await TempRegister.deleteOne({
      regisToken: token,
    });
    return res.status(400).json({
      success: false,
      mess: "Token has expired",
    });
  }

  const user = await User.create({
    name: infoUser?.name,
    email: infoUser?.email,
    password: infoUser?.password,
    role: infoUser?.role || "User",
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

//  login
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

  if (password !== user.password) {
    return res.status(401).json({
      success: false,
      mess: "Incorrect password",
    });
  }

  const accessToken = genAccessToken(user._id, user.role);
  const refreshToken = genRefreshToken(user._id, user.role);

  await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  const { password: _, ...userData } = user.toObject();

  return res.status(200).json({
    success: true,
    accessToken,
    userData,
  });
});

//  getCurrent
const getCurrent = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const userData = await User.findById(_id).select("-refreshToken");

  return res.status(200).json({
    success: userData ? true : false,
    mess: userData ? userData : "Can not get data User",
  });
});

//  eventRegistration
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

  const eventRegisted = user.eventsAttended.find(
    (el) => el?.event.toString() === eventId
  );
  if (eventRegisted) {
    return res.status(400).json({
      success: false,
      mess: "You have already registered for this event",
    });
  }

  if (event.isPaid) {
    const qrCodeUrl = `https://example.com/payment?eventId=${eventId}&userId=${_id}`;
    return res.status(200).json({
      success: true,
      mess: "This event requires payment. Please complete the payment to register.",
      qrCodeUrl,
      price: event.price,
    });
  }

  user.eventsAttended.push({ event: eventId });
  event.attendees.push(_id);
  await event.save();
  const userRegisted = await user.save();

  const html = `Xin chào ${user?.name}, bạn đã hoàn tất quá trình đăng ký sự kiện ${event?.title}.`;
  await sendMail({
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

//getAllUsers
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, search, eventStatus } = req.query;
  let query = {};
  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  let users = await User.find(query)
    .select("-password -refreshToken")
    .populate({
      path: "eventsAttended.event",
      select: "title",
    })
    .populate({
      path: "assignedEvents.event",
      select: "title",
    });

  if (eventStatus && eventStatus !== "all") {
    users = users.filter((user) =>
      user.eventsAttended.some(
        (eventEntry) => eventEntry.status === eventStatus
      )
    );
  }

  return res.status(200).json({
    success: true,
    mess: users,
  });
});

//getUserById
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).select("-password -refreshToken");
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    mess: user,
  });
});

//updateUser
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, phone, address, profileImage } =
    req.body;

  const updateData = { name, email, role, phone, address, profileImage };
  if (password) {
    updateData.password = password; // Lưu mật khẩu không mã hóa (theo logic hiện tại của bạn)
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  }).select("-password -refreshToken");
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    mess: user,
  });
});

//deleteUser
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      mess: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    mess: "User deleted successfully",
  });
});

// Phân công sự kiện cho staff
const assignEventToStaff = asyncHandler(async (req, res) => {
  const { staffId, eventId } = req.body;

  const staff = await User.findById(staffId);
  if (!staff || staff.role !== "Staff") {
    return res.status(404).json({
      success: false,
      mess: "Staff not found or user is not a staff",
    });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({
      success: false,
      mess: "Event not found",
    });
  }

  // Kiểm tra xem sự kiện đã được phân công cho staff này chưa
  const alreadyAssigned = staff.assignedEvents.some(
    (entry) => entry.event.toString() === eventId
  );
  if (alreadyAssigned) {
    return res.status(400).json({
      success: false,
      mess: "Event already assigned to this staff",
    });
  }

  // Thêm sự kiện vào danh sách assignedEvents của staff
  staff.assignedEvents.push({ event: eventId });
  await staff.save();

  return res.status(200).json({
    success: true,
    mess: "Event assigned successfully",
  });
});



const removeAssignedEvent = async (req, res) => {
  try {
    const { staffId, eventId } = req.body;
    const user = await User.findById(staffId);
    if (!user || user.role !== 'Staff') {
      return res.status(400).json({ success: false, mess: 'Invalid staff member' });
    }
    const eventIndex = user.assignedEvents.findIndex(
      (entry) => entry.event.toString() === eventId
    );
    if (eventIndex === -1) {
      return res.status(400).json({ success: false, mess: 'Event not assigned to this staff' });
    }
    user.assignedEvents.splice(eventIndex, 1);
    await user.save();
    res.status(200).json({ success: true, mess: 'Event removed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, mess: error.message });
  }
};


module.exports = {
  createUser,
  refreshToken,
  finalRegister,
  login,
  getCurrent,
  eventRegistration,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  assignEventToStaff,
  removeAssignedEvent,
};
