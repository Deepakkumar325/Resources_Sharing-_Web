module.exports = function (req, res, next) {
    console.log("auth: " + req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/users/login');
    req.flash('error_msg', 'Please login to continue');
}
