const Speaker = require('../models/speaker')
const asyncHandler = require('express-async-handler')


const createSpeaker = asyncHandler(async (req, res) => {
    try {
      const { name, bio, photoUrl, socialLinks } = req.body;
  
      if (!name || !bio) {
        return res.status(400).json({ success: false, message: "Name and bio are required" });
      }
  
      const speaker = await Speaker.create({ name, bio, photoUrl, socialLinks });
  
     return res.status(201).json({
        success: true,
        message: "Speaker created successfully",
        data: speaker,
      });
    } catch (error) {
     return res.status(500).json({ success: false, message: "Server error", error });
    }
  });
  

  const updateSpeaker = asyncHandler(async (req, res) => {
    try {
      const { sid } = req.params;
      const updatedSpeaker = await Speaker.findByIdAndUpdate(sid, req.body, { new: true });
  
      if (!updatedSpeaker) {
        return res.status(404).json({ success: false, message: "Speaker not found" });
      }
  
    return  res.status(200).json({
        success: true,
        message: "Speaker updated successfully",
        data: updatedSpeaker,
      });
    } catch (error) {
     return res.status(500).json({ success: false, message: "Server error", error });
    }
  });
  

  const deleteSpeaker = asyncHandler(async (req, res) => {
    try {
      const { sid } = req.params;
  
      const speaker = await Speaker.findById(sid);
      if (!speaker) {
        return res.status(404).json({ success: false, message: "Speaker not found" });
      }
  
      await Speaker.findByIdAndDelete(sid);
  
    return  res.status(200).json({
        success: true,
        message: "Speaker deleted successfully",
      });
    } catch (error) {
     return res.status(500).json({ success: false, message: "Server error", error });
    }
  });
  

  const getAllSpeakers = asyncHandler(async (req, res) => {
    try {
      const speakers = await Speaker.find().limit(10);
  
    return res.status(200).json({
        success: true,
        data: speakers,
      });
    } catch (error) {
    return  res.status(500).json({ success: false, message: "Server error", error });
    }
  });


  module.exports ={
    createSpeaker,
    updateSpeaker,
    getAllSpeakers,
    deleteSpeaker
  }