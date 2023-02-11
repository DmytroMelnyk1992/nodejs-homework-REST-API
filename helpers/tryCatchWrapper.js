const tryCatchWrapper = (tryCatch) => {
  const func = async (req, res, next) => {
    try {
      await tryCatch(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return func;
};

module.exports = tryCatchWrapper;
