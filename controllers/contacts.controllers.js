const { Contact } = require("../models/contacts");

async function getAllContacts(req, res) {
  const allContacts = await Contact.find();
  res.status(200).json(allContacts);
}

async function getContactById(req, res) {
  const { contactId } = req.params;
  const contactById = await Contact.findById(contactId);

  if (!contactById) {
    return res.status(404).json({ message: "Not found" });
  }
res.status(200).json(contactById);
}

async function addContact(req, res) {
  const body = req.body;
  const newContact = await Contact.create(body);
  res.status(201).json(newContact);
}

async function removeContact(req, res) {
  const { contactId } = req.params;
  const remove = await Contact.findByIdAndRemove(contactId);

  if (!remove) {
    return res.status(404).json({ message: "Not found" });
  }

  return res.status(200).json({ message: "Contact deleted" });
}

async function updateContact(req, res) {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
}

async function updateStatusOfContact(req, res) {
  const { contactId } = req.params;
  const updatedContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!updatedContact) {
    return res.status(404).json({ message: "Not found" });
  }
  res.status(200).json(updatedContact);
}

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusOfContact,
};
