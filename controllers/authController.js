const jwt = require('jsonwebtoken');
const User = require('../model/userModal');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  //   const newUser = await User.create({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.boy.password,
  //     passwordConfirm: req.body.passwordConfirm
  //   });
  // creating the PAYLOAD and SECRET the token will be created automatically
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});
