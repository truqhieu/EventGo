const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const TempRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  regisToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  role: { type: String, enum: ["User", "Admin", "Staff"], default: "User" },
},{
  timestamps:true
});


module.exports = mongoose.model("TempRegister", TempRegisterSchema);
