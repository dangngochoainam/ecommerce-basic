'use strict';

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(req.body);
      return res.status(201).json({
        code: 201,
        metadata: { userId: 1 },
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

module.exports = new AccessController();
