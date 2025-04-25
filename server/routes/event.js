const ctrls = require("../controllers/event");
const { isAdmin, verifyToken } = require("../middlewares/verify");
const router = require("express").Router();
const uploader = require('../config/cloudinary.config')
router.post(
  "/registerevent",
  // [verifyToken, isAdmin],
  ctrls.listUserRegisEvent
);

// router.post(
//   "/registerevent2",
//   // [verifyToken, isAdmin],
//   ctrls.listUserRegisEvent2
// );
router.get("/getHotestEvent", ctrls.getHotestEvent);

router.post("/updstatuseventregistant", ctrls.updateStatus);


router.get("/category", ctrls.getEventByCategoryName);
router.post("/", uploader.fields([
  { name: 'logoImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), ctrls.createEvent);


router.get("/", ctrls.listAllEvent);
router.get("/categorydefaultleft", ctrls.getEventByCategoryLeft);
router.get("/categorydefaultright", ctrls.getEventByCategoryRight);
router.get("/:eid", ctrls.getEventById);

router.post("/insertmany", [verifyToken, isAdmin], ctrls.createManyEvent);

router.post('/feedbackuser',[verifyToken],ctrls.feedbackComment)
router.post('/replyfeedbackuser',[verifyToken,isAdmin],ctrls.replyFeedbackComment)
router.post('/updatefeedbackuser',[verifyToken],ctrls.updateFeedback)
router.post('/deletefeedbackuser',[verifyToken],ctrls.deleteFeedback)

router.put("/updevent",uploader.fields([
  { name: 'logoImage', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 }
]), ctrls.updateEvent);



router.delete("/:eid", ctrls.deleteEvent);


module.exports = router;
