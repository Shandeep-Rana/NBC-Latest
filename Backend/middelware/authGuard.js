function isAdmin(req, res, next) {
    if (req.user && req.user.roles === 'admin') {
      return next(); 
    }
    res.status(403).json({ error: 'Permission denied' }); 
  }

  function isAdminOrVolunteer(req, res, next) {
    const user = req.user;
    if (user && (user.roles === 'admin' || user.roles === 'volunteers')) {
      return next();  
    }
    res.status(403).json({ error: 'Permission denied' });  
  }

  module.exports = {isAdmin, isAdminOrVolunteer};