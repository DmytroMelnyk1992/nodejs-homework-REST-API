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

const tryCatchWrapper = require("../../helpers/tryCatchWrapper ");

const router = express.Router();

router.get("/", tryCatchWrapper(getAllContacts));

router.get("/:contactId", tryCatchWrapper(getContactById));

router.post("/", validateContact(newContacts), tryCatchWrapper(addContact));

router.delete("/:contactId", tryCatchWrapper(removeContact));

router.put(
  "/:contactId",
  validateUpdatedContact(editContacts),
  tryCatchWrapper(updateContact)
);

router.patch(
  "/:contactId/favorite",
  validateContact(favoriteSchema),
  tryCatchWrapper(updateStatusOfContact)
);

module.exports = router;
