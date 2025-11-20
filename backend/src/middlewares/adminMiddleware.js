/* eslint-disable consistent-return */

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ error: "Admin access only" });
  next();
};

module.exports = adminOnly;
