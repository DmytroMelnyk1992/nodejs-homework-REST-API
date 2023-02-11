function validateContact(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(404).json({ message: "missing fields" });
    }

    return next();
  };
}

function validateUpdatedContact(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return next();
  };
}

module.exports = {
  validateContact,
  validateUpdatedContact,
};
