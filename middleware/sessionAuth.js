// Update the sessionAuth middleware to check for suspended status
module.exports = (req, res, next) => {
  // Check if user is logged in
  if (!req.session.user) {
    req.session.error = "Please log in to access this page"
    return res.redirect("/userlogin")
  }

  // Check if user is suspended
  if (req.session.user.is_suspended) {
    req.session.error = "Your account has been suspended. Please contact an administrator."
    req.session.destroy()
    return res.redirect("/userlogin")
  }

  
  next()
}
