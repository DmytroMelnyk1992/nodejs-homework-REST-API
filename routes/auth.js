const express = require("express");
const {
  register,
  login,
  logout,
  userInfo,
  updateSubscription,
} = require("../controllers/auth.controller");
const tryCatchWrapper = require("../helpers/tryCatchWrapper");
const {
  authUser,
  updateUserSubscription,
} = require("../helpers/validationUsersSubscription");
const { validationAuth } = require("../helpers/validationAuth");
const { tokenValidation } = require("../helpers/tokenValidation");

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

module.exports = {
  authRouter,
};
