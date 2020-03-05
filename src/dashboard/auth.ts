const auth = (req, res, next) => {
  console.log(req.session);
  // Check if logged in
  if (true) {
    next();
  } else {
    res.redirect('/login');
  }
};

export default auth;
