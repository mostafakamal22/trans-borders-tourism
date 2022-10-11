//check password === repeated password

//@useCase:- when admin updating his info
const comparePassword = async (req, res, next) => {
  const { password, repeatedPassword } = req.body;

  if (password !== repeatedPassword) {
    return res.status(400).send("password does not match");
  } else {
    return next();
  }
};

module.exports = {
  comparePassword,
};
