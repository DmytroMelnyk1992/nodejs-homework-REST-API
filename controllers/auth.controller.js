const { User } = require("../models/user");
const { Conflict, Unauthorized, NotFound, BadRequest } = require("http-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendMail } = require("../helpers/sendMail");
const { JWT_SECRET } = process.env;

async function register(req, res, next) {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  const verificationToken = nanoid();

  try {
    const savedUser = await User.create({
      email,
      password: hashedPassword,
      avatarURL: gravatar.url(email),
    });

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    res.status(201).json({
      data: {
        user: savedUser,
        email,
        id: savedUser._id,
      },
    });
  } catch (error) {
    if (error.message.includes("E11000 duplicate key error")) {
      throw new Conflict(409, "User with this email is already exist");
    }
    throw error;
  }
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const storedUser = await User.findOne({
    email,
  });
  if (!storedUser) {
    throw Unauthorized(401, "Email is not valid");
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    throw Unauthorized(401, "Email or password is wrong");
  }
  const payload = { id: storedUser._id };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  await User.findByIdAndUpdate(storedUser._id, { token });
  return res.status(200).json({
    token: token,
    user: {
      email,
      subscription: storedUser.subscription,
      id: storedUser._id,
    },
  });
}

async function logout(req, res, next) {
  const storedUser = req.user;
  await User.findByIdAndUpdate(storedUser._id, { token: "" });
  return res.status(204).end();
}

async function userInfo(req, res, next) {
  const { user } = req;
  const { email, subscription } = user;

  return res.status(200).json({
    user: {
      email,
      subscription,
    },
  });
}

async function updateSubscription(req, res, next) {
  const { id } = req.user;
  const { subscription } = req.body;
  console.log("subscription", subscription);
  const upUser = await User.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json(upUser);
}

async function verifyEmail(req, res, next) {
  const { verificationToken } = req.params;

  const user = await User.findOne({
    verificationToken: verificationToken,
  });

  if (!user) {
    throw NotFound("User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  return res.status(200).json({
    message: "Verification successful",
  });
}

async function repeatVerifyEmail(req, res, next) {
  const { email } = req.body;

  if (!email) {
    throw BadRequest("Missing required field email");
  }

  try {
    const storedUser = await User.findOne({
      email,
    });

    if (!storedUser) {
      throw BadRequest("User not found");
    }

    const verificationToken = storedUser.verificationToken;

    if (!verificationToken) {
      throw BadRequest("Verification has already been passed");
    }

    await sendMail({
      to: email,
      subject: "Please confirm your email",
      html: `<a href="localhost:3000/api/users/verify/${verificationToken}">Confirm your email</a>`,
    });

    res.status(201).json({
      user: {
        email,
        subscription: storedUser.subscription,
        id: storedUser._id,
        avatarURL: storedUser.avatarURL,
      },
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function uploadAvatar(req, res, next) {
  const { id } = req.user;
  const { filename } = req.file;
  const tmpPath = path.resolve(__dirname, "./tmp", filename);
  const publicPath = path.resolve(__dirname, "./public/avatars", filename);

  await Jimp.read(tmpPath)
    .then((image) => {
      return image.resize(250, 250).write(tmpPath);
    })
    .catch((error) => {
      console.error(error);
    });

  try {
    await fs.rename(tmpPath, publicPath);
  } catch (error) {
    await fs.unlink(tmpPath);
    return error;
  }

  const uploadUser = await User.findByIdAndUpdate(
    id,
    {
      avatarURL: `/public/avatars/${filename}`,
    },
    {
      new: true,
    }
  );

  return res.status(200).json({
    user: {
      email: uploadUser.email,
      avatarURL: uploadUser.avatarURL,
    },
  });
}

module.exports = {
  register,
  login,
  logout,
  userInfo,
  updateSubscription,
  verifyEmail,
  repeatVerifyEmail,
  uploadAvatar,
};
