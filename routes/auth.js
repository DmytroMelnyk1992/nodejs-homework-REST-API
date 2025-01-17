const express = require("express");
const {
  register,
  login,
  logout,
  userInfo,
  updateSubscription,
  verifyEmail,
  repeatVerifyEmail,
  uploadAvatar,
} = require("../controllers/auth.controller");
const tryCatchWrapper = require("../helpers/tryCatchWrapper");
const {
  authUser,
  updateUserSubscription,
} = require("../helpers/validationUsersSubscription");
const { validationAuth } = require("../helpers/validationAuth");
const { tokenValidation } = require("../helpers/tokenValidation");
const { upload } = require("../helpers/uploadAvatar.js");

const authRouter = express.Router();

authRouter.post(
  "/register",
  validationAuth(authUser),
  tryCatchWrapper(register)
);
authRouter.post("/login", validationAuth(authUser), tryCatchWrapper(login));
authRouter.post(
  "/logout",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(logout)
);
authRouter.get(
  "/current",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(userInfo)
);
authRouter.patch(
  "/",
  tryCatchWrapper(tokenValidation),
  validationAuth(updateUserSubscription),
  tryCatchWrapper(updateSubscription)
);
authRouter.patch(
  "/avatars",
  upload.single("avatar"),
  tryCatchWrapper(uploadAvatar)
);

authRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
authRouter.post("/verify", tryCatchWrapper(repeatVerifyEmail));

module.exports = {
  authRouter,
};
