const express = require("express");
const ctrls = require("../controllers/speaker"); // Import Controller
const { isAdmin, verifyToken } = require("../middlewares/verify"); // Middleware bảo vệ route

const router = express.Router();

router.post("/",[verifyToken,isAdmin], ctrls.createSpeaker);
router.get("/",ctrls.getAllSpeakers)
router.put('/:sid',[verifyToken,isAdmin],ctrls.updateSpeaker)
router.delete('/:sid',[verifyToken,isAdmin],ctrls.deleteSpeaker)



module.exports = router;
