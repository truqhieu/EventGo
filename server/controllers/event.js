const Event = require("../models/event");
const User = require("../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const createEvent = asyncHandler(async (req, res) => {
  const { title, description, date, location, capacity, category } = req.body;

  if (
    !title ||
    !description ||
    !date ||
    !location ||
    capacity == null ||
    !category
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing input to create Event" });
  }

  const capacityNum = parseInt(capacity, 10);
  if (isNaN(capacityNum) || capacityNum <= 0) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid capacity number" });
  }

  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid date format" });
  }

  let logoImageURL = req.files?.logoImage?.[0]?.path || null;
  let backgroundImageURL = req.files?.backgroundImage?.[0]?.path || null;

  const newEventData = {
    title,
    description,
    date: eventDate,
    location,
    category,
    capacity: capacityNum,
    logoImage: logoImageURL,
    backgroundImage: backgroundImageURL,
    // organizer: req.user._id, // nếu bạn cần
  };

  try {
    const createdEvent = await Event.create(newEventData);
    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: createdEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating event",
      error: error.message,
    });
  }
});

const createManyEvent = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { events } = req.body;

  if (!Array.isArray(events) || events.length === 0) {
    throw new Error("Events must be a non-empty array");
  }
  const formateEvent = events.map((event) => {
    const { title, description, location, date, capacity } = event;
    if (!title || !description || !location || !date || !capacity) {
      throw new Error("Missing input to insert many event");
    }

    const formatDate = new Date(date);
    if (isNaN(formatDate.getTime())) {
      throw new Error("Invalid date format");
    }

    return {
      ...event,
      date: formatDate,
      organizer: _id,
    };
  });
  const response = await Event.insertMany(formateEvent);

  return res.status(200).json({
    success: response.length > 0 ? true : false,
    message:
      response.length > 0
        ? `${response.length} events created successfully`
        : "Failed to create events",
    events: response,
  });
});

const updateEvent = asyncHandler(async (req, res) => {
  try {
    console.log(">>> [updateEvent] req.body:", req.body);
    console.log(">>> [updateEvent] req.files:", req.files);

    // 1) Lấy dữ liệu từ client
    const {
      eid,
      title,
      description,
      date,
      endDate,
      location,
      capacity,
      category,
      status,
      speakerIds,
    } = req.body;

    if (!eid) {
      return res
        .status(400)
        .json({ success: false, mess: "Missing event ID (eid)" });
    }

    // 2) Tìm event trong DB
    const event = await Event.findById(eid);
    if (!event) {
      return res.status(404).json({ success: false, mess: "Event not found" });
    }

    // 3) Cập nhật các trường đơn giản nếu client gửi
    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date && !isNaN(new Date(date + "T00:00:00Z"))) {
      event.date = new Date(date + "T00:00:00Z");
    }
    if (endDate && !isNaN(new Date(endDate + "T00:00:00Z"))) {
      event.endDate = new Date(endDate + "T00:00:00Z");
    }
    if (location !== undefined) event.location = location;
    if (capacity !== undefined) event.capacity = capacity; // Mongoose tự cast string->number
    if (category !== undefined) event.category = category;
    if (status !== undefined) event.status = status;

    // 4) Cập nhật ảnh upload nếu có
    if (req.files?.logoImage?.[0]) {
      event.logoImage = req.files.logoImage[0].path;
    }
    if (req.files?.backgroundImage?.[0]) {
      event.backgroundImage = req.files.backgroundImage[0].path;
    }

    // 5) Parse & cập nhật nested organizerUnit
    if (req.body.organizerUnit) {
      try {
        const unit = JSON.parse(req.body.organizerUnit);
        event.organizerUnit = {
          name: unit.name ?? event.organizerUnit?.name ?? "",
          address: unit.address ?? event.organizerUnit?.address ?? "",
          contactInfo: {
            phone:
              unit.contactInfo?.phone ??
              event.organizerUnit?.contactInfo?.phone ??
              "",
            email:
              unit.contactInfo?.email ??
              event.organizerUnit?.contactInfo?.email ??
              "",
          },
        };
      } catch (err) {
        console.error("❌ Invalid organizerUnit JSON:", err);

        return res
          .status(400)
          .json({ success: false, mess: "Invalid organizerUnit format" });
      }
    }

    // 6) Parse & merge speakerIds
    if (speakerIds) {
      const arr = Array.isArray(speakerIds) ? speakerIds : [speakerIds];
      event.speaker = event.speaker || [];
      const existing = new Set(event.speaker.map((id) => id.toString()));
      arr.forEach((id) => {
        if (!existing.has(id)) {
          event.speaker.push(new mongoose.Types.ObjectId(id)); // <<< ép thành ObjectId
          existing.add(id);
        }
      });
    }

    // 7) Lưu vào DB và trả kết quả
    const updated = await event.save();
    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updated,
    });
  } catch (err) {
    console.error("❌ Unexpected error in updateEvent:", err);
    console.error("❌ Unexpected error in updateEvent:", err);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error stack:", err.stack);
    return res.status(500).json({
      success: false,
      mess: "Internal server error",
    });
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eid } = req.params;
  const event = await Event.findById(eid);

  if (!event) {
    return res.status(404).json({
      success: false,
      message: "Event not found",
    });
  }

  const response = await Event.findByIdAndDelete(eid);

  return res.status(200).json({
    success: true,
    message: response ? "Deleted Successfully" : "Failed to delete",
  });
});

const listAllEvent = asyncHandler(async (req, res) => {
  const result = await Event.find();
  return res.status(200).json({
    success: result ? true : false,
    mess: result ? result : "Some thing went wrong!!!",
  });
});

// const listUserRegisEvent2 = asyncHandler(async (req, res) => {
// // Kiểm tra trước khi truy vấn
// const list = await Event.find({
//   attendees: { $exists: true, $not: { $size: 0 } }
// }).populate("attendees", "eventsAttended name -_id").select('title');

//   // const dataReturn = list.attendees.map((user) => {

//   //   const data = user?.eventsAttended.map((item) => ({
//   //     idEvent:item?.event,
//   //     status: item?.status,
//   //     registeredAt: item.registeredAt,
//   //   }));

//   //   return {
//   //     name: user?.name,
//   //     statusRegisEvent: data,
//   //   };
//   // });
//   return res.status(200).json({
//     success: list ? true : false,
//     mess: {
//       length:list.length,
//       event: list,
//       // attendees:dataReturn,
//     },
//   });
// });
const listUserRegisEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  const list = await Event.findById(eventId).populate(
    "attendees",
    "eventsAttended name email"
  );

  if (!list) {
    return res.status(404).json({
      success: false,
      mess: "Event not found",
    });
  }

  const dataReturn = list.attendees.map((user) => {
    const filteredEvents = user?.eventsAttended.filter(
      (item) => item?.event?.toString() === eventId
    );

    const data = filteredEvents.map((item) => ({
      idEvent: eventId,
      status: item?.status,
      registeredAt: item?.registeredAt,
    }));

    return {
      name: user?.name,
      id: user?._id,
      email: user?.email,
      eventstatus: list?.status,
      statusRegisEvent: data,
    };
  });

  return res.status(200).json({
    success: true,
    mess: {
      title: list.title,
      date: list?.date,
      endDate: list?.endDate,
      capacity: list?.capacity,
      eventstatus: list?.status,
      attendees: dataReturn,
    },
  });
});

const updateStatus = asyncHandler(async (req, res) => {
  const { uid, statusEvent, eid } = req.body;
  // Kiểm tra xem uid và eid có phải là ObjectId hợp lệ không
  if (
    !mongoose.Types.ObjectId.isValid(uid) ||
    !mongoose.Types.ObjectId.isValid(eid)
  ) {
    return res.status(400).json({
      success: false,
      mess: "Invalid uid or eid. Must be a valid ObjectId.",
    });
  }

  if (statusEvent === "cancelled") {
    // const updatedStatusEvent = await User.findOneAndUpdate(
    //   { _id: uid, "eventsAttended.event": eid },
    //   { $set: { "eventsAttended.$.status": statusEvent } },
    //   { new: true }
    // );
    const user = await User.findById(uid);
    const filterUserRegistant = user?.eventsAttended?.filter(
      (item) => item?.event.toString() !== eid
    );
    user.eventsAttended = filterUserRegistant;
    await user.save();
    const event = await Event.findById(eid);
    const filterEventRegistant = event?.attendees?.filter(
      (item) => item?.toString() !== uid
    );
    event.attendees = filterEventRegistant;
    await event.save();

    return res.status(200).json({
      success: true,
      mess: "Registration cancelled successfully",
    });
  }
  if (statusEvent === "confirmed") {
    const updatedStatusEvent = await User.findOneAndUpdate(
      { _id: uid, "eventsAttended.event": eid },
      { $set: { "eventsAttended.$.status": statusEvent } },
      { new: true }
    );
    return res.status(200).json({
      success: updatedStatusEvent ? true : false,
      mess: "Registration confirmed successfully",
    });
  }

  // if (!updatedStatusEvent) {
  //   return res.status(404).json({
  //     success: false,
  //     mess: "User or event not found",
  //   });
  // }
  //  else{
  //   const updatedStatusEvent = await User.findOneAndUpdate(
  //     { _id: uid, "eventsAttended.event": eid },
  //     { $set: { "eventsAttended.$.status": statusEvent } },
  //     { new: true }
  //   );

  // if (!updatedStatusEvent) {
  //   return res.status(404).json({
  //     success: false,
  //     mess: "User or event not found",
  //   });
  // }
  // return res.status(200).json({
  //   success: true,
  //   mess: "Event status updated successfully",
  //   data: updatedStatusEvent,
  // });
});

const getEventByCategoryLeft = asyncHandler(async (req, res) => {
  const technologyEvent = await Event.find({ category: "Technology" })
    .sort("-date")
    .limit(1);

  const businessEvent = await Event.find({ category: "Business" })
    .sort("-date")
    .limit(1);
  const designEvent = await Event.find({ category: "Design" })
    .sort("-date")
    .limit(1);
  const educationEvent = await Event.find({ category: "Education" })
    .sort("-date")
    .limit(1);

  // Ghép kết quả lại thành mảng
  const result = [
    ...technologyEvent,
    ...businessEvent,
    ...designEvent,
    ...educationEvent,
  ];

  return res.status(200).json({
    success: result.length === 4,
    length: result.length,
    mess: result,
  });
});

const getEventByCategoryRight = asyncHandler(async (req, res) => {
  const categories = ["Science", "Health", "Entertainment", "Cuisine"];

  // Lấy sự kiện cho mỗi danh mục
  const scienceEvent = await Event.find({ category: "Science" })
    .sort("-date")
    .limit(1);
  const healthEvent = await Event.find({ category: "Health" })
    .sort("-date")
    .limit(1);
  const entertainmentEvent = await Event.find({ category: "Entertainment" })
    .sort("-date")
    .limit(1);
  const cuisineEvent = await Event.find({ category: "Cuisine" })
    .sort("-date")
    .limit(1);

  // Ghép kết quả lại thành mảng
  const result = [
    ...scienceEvent,
    ...healthEvent,
    ...entertainmentEvent,
    ...cuisineEvent,
  ];

  // Trả về kết quả
  return res.status(200).json({
    success: result.length === 4, // Kiểm tra có đủ 4 sự kiện không
    length: result.length,
    mess: result,
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const { eid } = req.params;

  const response = await Event.findById(eid)
    .populate("speaker", "name")
    .populate({
      path: "feedback.userId",
      select: "name", // Chỉ lấy tên user comment
    })
    .populate({
      path: "feedback.replies.adminId",
      select: "name", // Lấy tên admin đã phản hồi
    })
    .populate("waitlist", "name email");

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not found Event!!!",
  });
});

const getEventByCategoryName = asyncHandler(async (req, res) => {
  const { category } = req.query;
  const response = await Event.find({ category: category }).populate(
    "speaker",
    "name"
  );

  return res.status(200).json({
    success: response ? true : false,
    mess: response ? response : "Can not found Event!!!",
  });
});

// const getEventByCategoryLeft = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 4 } = req.query;

//   const events = await Event.find({ category: { $in: ["Technology", "Business", "Design", "Education"] } })
//     .sort("-date")
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//   return res.status(200).json({
//     success: true,
//     page: parseInt(page),
//     length: events.length,
//     mess: events,
//   });
// });

// const getEventByCategoryRight = asyncHandler(async (req, res) => {
//   const { page = 1, limit = 4 } = req.query;

//   const events = await Event.find({ category: { $in: ["Science", "Health", "Entertainment", "Cuisine"] } })
//     .sort("-date")
//     .skip((page - 1) * limit)
//     .limit(parseInt(limit));

//   return res.status(200).json({
//     success: true,
//     page: parseInt(page),
//     length: events.length,
//     mess: events,
//   });
// });

// const getEventByCategoryRight = asyncHandler(async (req, res) => {
//   const field = ["Science", "Health", "Entertainment", "Cuisine"];

//   const result = await Event.find({ category: { $in: field } }).sort("-date");

//   return res.status(200).json({
//     success: result ? true : false,
//     length: result.length,
//     mess: result,
//   });
// });

const registerOrWaitlist = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.body;
  const event = await Event.findById(eventId);
  if (!event)
    return res.status(404).json({ success: false, mess: "Event not found" });

  // đã registered hoặc chờ rồi
  if (event.attendees.includes(userId) || event.waitlist.includes(userId)) {
    return res
      .status(400)
      .json({ success: false, mess: "Already booked or waitlisted" });
  }

  if (event.attendees.length < event.capacity) {
    event.attendees.push(userId);
    await event.save();
    return res.json({
      success: true,
      confirmed: true,
      mess: "Booked successfully",
    });
  } else {
    // hết chỗ → waitlist
    return res.status(400).json({
      success: false,
      full: true,
      mess: "Event is full",
    });
  }
});

const joinWaitList = asyncHandler(async (req, res) => {
  const { eventId, userId } = req.body;
  const event = await Event.findById(eventId);
  if (!event)
    return res.status(404).json({ success: false, mess: "Event not found" });

  if (event.attendees.includes(userId) || event.waitlist.includes(userId)) {
    return res
      .status(400)
      .json({ success: false, mess: "Already booked or waitlisted" });
  }

  event.waitlist.push(userId);
  await event.save();
  return res.json({
    success: true,
    waitlisted: true,
    mess: "Added to waitlist",
  });
});

const getHotestEvent = asyncHandler(async (req, res) => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  let hotestEvent = await User.aggregate([
    { $unwind: "$eventsAttended" },
    {
      $match: {
        "eventsAttended.registeredAt": { $gte: threeDaysAgo },
        "eventsAttended.status": { $in: ["pending", "confirmed"] },
      },
    },
    {
      $group: {
        _id: "$eventsAttended.event",
        registrationCount: { $sum: 1 },
        users: { $push: { userId: "$_id", name: "$name", email: "$email" } },
      },
    },
    { $sort: { registrationCount: -1 } },
    { $limit: 1 },
  ]);

  // Nếu không có sự kiện nào trong 3 ngày qua, lấy sự kiện có lượt đăng ký nhiều nhất từ trước đến nay
  if (!hotestEvent.length) {
    hotestEvent = await User.aggregate([
      { $unwind: "$eventsAttended" },
      {
        $match: {
          "eventsAttended.status": { $in: ["pending", "confirmed"] },
        },
      },
      {
        $group: {
          _id: "$eventsAttended.event",
          registrationCount: { $sum: 1 },
          users: { $push: { userId: "$_id", name: "$name", email: "$email" } },
        },
      },
      { $sort: { registrationCount: -1 } },
      { $limit: 1 },
    ]);
  }

  // Nếu vẫn không có sự kiện nào, trả về null
  if (!hotestEvent.length) {
    return res.status(200).json({
      success: true,
      mess: "No event data available",
      data: null,
    });
  }

  const eventDetail = await Event.findById(hotestEvent[0]._id)
    .populate("organizer", "name email")
    .populate("speaker");

  if (!eventDetail) {
    return res.status(404).json({
      success: false,
      mess: "Event not found",
    });
  }

  return res.status(200).json({
    success: true,
    mess: "Hotest event found successfully",
    data: {
      event: {
        id: eventDetail._id,
        title: eventDetail.title,
        description: eventDetail.description,
        date: eventDetail.date,
        endDate: eventDetail.endDate,
        location: eventDetail.location,
        category: eventDetail.category,
        capacity: eventDetail.capacity,
        status: eventDetail.status,
        backgroundImage: eventDetail.backgroundImage,
        logoImage: eventDetail.logoImage,
        organizer: eventDetail.organizer,
        speaker: eventDetail.speaker,
      },
      registrationCount: hotestEvent[0].registrationCount,
      recentRegistrations: hotestEvent[0].users.slice(0, 5),
    },
  });
});

const feedbackComment = asyncHandler(async (req, res) => {
  const { eventId, comment } = req.body;
  const userId = req.user._id;

  if (!comment) {
    return res.status(400).json({ message: "Bình luận không được để trống!" });
  }

  const event = await Event.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Sự kiện không tồn tại!" });
  }

  const now = new Date();
  if (event.date > now) {
    return res
      .status(400)
      .json({ message: "Sự kiện chưa diễn ra, không thể bình luận!" });
  }

  // Thêm feedback vào User
  await User.updateOne(
    { _id: userId, "eventsAttended.event": eventId },
    {
      $push: {
        "eventsAttended.$.feedbacks": {
          comment,
          createdAt: now,
          updatedAt: now,
        },
      },
    }
  );

  // Thêm feedback vào Event
  const updatedEvent = await Event.findByIdAndUpdate(
    eventId,
    {
      $push: {
        feedback: {
          userId,
          feedbackComment: comment,
          createdAt: now,
          updatedAt: now,
        },
      },
    },
    { new: true }
  ).populate("feedback.userId", "name email"); // Lấy thông tin người dùng

  res.status(200).json({
    success: true,
    message: "Feedback đã được lưu thành công!",
    event: updatedEvent, // Trả về event mới nhất
  });
});

const replyFeedbackComment = asyncHandler(async (req, res) => {
  try {
    const { eventId, feedbackId, replyComment } = req.body;

    // console.log(eventId,feedbackId, replyComment);
    const { _id } = req.user;
    if (!replyComment) {
      return res.status(400).json({ message: "Reply comment is required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const feedback = event.feedback.id(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    // Add reply
    feedback.replies.push({
      adminId: _id,
      replyComment,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await event.save();

    res.status(200).json({ message: "Reply added successfully", feedback });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const updateFeedback = asyncHandler(async (req, res) => {
  try {
    const { eventId, feedbackId, feedbackComment } = req.body;
    const userId = req.user._id;

    if (!feedbackComment) {
      return res.status(400).json({ message: "Feedback comment is required" });
    }

    // Tìm Event chứa feedback
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Tìm feedback trong Event
    const feedbackIndex = event.feedback.findIndex(
      (fb) => fb._id.toString() === feedbackId
    );
    if (feedbackIndex === -1) {
      return res.status(404).json({ message: "Feedback not found in event" });
    }

    const feedback = event.feedback[feedbackIndex];

    // Kiểm tra quyền sở hữu
    if (feedback.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to modify this feedback" });
    }

    // Cập nhật feedback trong Event
    feedback.feedbackComment = feedbackComment;
    feedback.updatedAt = new Date();

    // Lưu thay đổi vào DB
    await event.save();

    res
      .status(200)
      .json({ message: "Feedback updated successfully", feedback });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const deleteFeedback = asyncHandler(async (req, res) => {
  try {
    const { eventId, feedbackId } = req.body;
    const userId = req.user._id;

    // Tìm Event chứa feedback
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Tìm feedback trong Event
    const feedbackIndex = event.feedback.findIndex(
      (fb) => fb._id.toString() === feedbackId
    );
    if (feedbackIndex === -1) {
      return res.status(404).json({ message: "Feedback not found in event" });
    }

    const feedback = event.feedback[feedbackIndex];

    // Kiểm tra quyền sở hữu
    if (feedback.userId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this feedback" });
    }

    // Xóa feedback khỏi mảng
    event.feedback.splice(feedbackIndex, 1);

    // Lưu thay đổi vào DB
    await event.save();

    res.status(200).json({ message: "Feedback deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});

const openSpots = asyncHandler(async (req, res) => {
  const { eventId, extra } = req.body;
  const event = await Event.findById(eventId);
  if (!event)
    return res.status(404).json({ success: false, mess: "Event not found" });
  const before = event.attendees.length;

  event.capacity += Number(extra);
  // tự động promote từ waitlist nếu có
  while (event.attendees.length < event.capacity && event.waitlist.length) {
    const userId = event.waitlist.shift();
    event.attendees.push(userId);
  }
  await event.save();
  const promoted = event.attendees.slice(before);
  await Promise.all(
    promoted.map((uid) =>
      User.findByIdAndUpdate(uid, {
        $push: {
          eventsAttended: {
            event: event._id,
            status: "pending",
            registeredAt: new Date(),
          },
        },
      })
    )
  );
  res.json({
    success: true,
    mess: `Added ${extra} spots, promoted users if any`,
  });
});

module.exports = {
  createEvent,
  updateEvent,
  deleteEvent,
  listAllEvent,
  listUserRegisEvent,
  // listUserRegisEvent2,
  updateStatus,
  getEventByCategoryLeft,
  getEventByCategoryRight,
  createManyEvent,
  getEventById,
  getEventByCategoryName,
  feedbackComment,
  getHotestEvent,
  joinWaitList,
  registerOrWaitlist,
  replyFeedbackComment,
  deleteFeedback,
  updateFeedback,
  openSpots,
};
