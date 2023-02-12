const express = require("express");
const {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusOfContact,
} = require("../../controllers/contacts.controllers");

const {
  newContacts,
  editContacts,
  favoriteSchema,
} = require("../../helpers/validation");

const {
  validateContact,
  validateUpdatedContact,
} = require("../../helpers/validationWrapper");

const tryCatchWrapper = require("../../helpers/tryCatchWrapper");
const tokenValidation = require("../../helpers/tokenValidation");

const router = express.Router();

router.get(
  "/",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(getAllContacts)
);

router.get(
  "/:contactId",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(getContactById)
);

router.post(
  "/",
  tryCatchWrapper(tokenValidation),
  validateContact(newContacts),
  tryCatchWrapper(addContact)
);

router.delete(
  "/:contactId",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(removeContact)
);

router.put(
  "/:contactId",
  tryCatchWrapper(tokenValidation),
  validateUpdatedContact(editContacts),
  tryCatchWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  tryCatchWrapper(tokenValidation),
  validateContact(favoriteSchema),
  tryCatchWrapper(updateStatusOfContact)
);

module.exports = router;
