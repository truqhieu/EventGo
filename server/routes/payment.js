const router = require("express").Router();
const { handlePayment } = require("../controllers/payment");

router.post("/process", handlePayment);

module.exports = router;