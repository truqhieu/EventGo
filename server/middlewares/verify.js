const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require('../models/user')

const verifyToken = asyncHandler(async (req, res, next) => {
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    const token = req?.headers?.authorization?.split(" ")[1];

    jwt.verify(token, process.env.ACESS_SECRETKEY, (err, decode) => {
      if (err) {
        return res.status(401).json({
          success: false,
          mess: "Invalid AccessToken",
        });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    return res.status(400).json({
      success: false,
      mess: "Require Authentication!",
    });
  }
});

const isAdmin = asyncHandler(async(req,res,next)=>{
  const {role} = req.user

  if(role !=='Admin'){
    return res.status(400).json({
      success:false,
      mess:'Require Admin Role!!!'
    })
  }

  next()
})

module.exports={
    verifyToken,
    isAdmin
}
