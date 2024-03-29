const User = require("../../model/user");

module.exports = async function (req, res, next) {
  const email = req.body.email;

  //   const user = await User.findOne({ email });
  //   if (!user) return res.status(404).send({ error: "Email Not Found" });

  if (!email) return res.status(400).send({ error: "Email is required" });

  const user = await User.findOne({ email });
  //  const activationToken = await user.genActivationToken();
  if (!user) return res.status(404).send({ error: "Email Not Found" });

  if (user.isActivated)
    return res.status(400).send({ error: "user is verified" });

  if (!user.isActivated)
    return res.status(400).send({ error: "User is not verified" });

  const isValid = await user.comparePassword(req.body.password);
  if (!isValid)
    return res.status(403).send({ error: "Invalid User and Password" });

  const auth_token = user.getAuthToken();

  const success = { message: "Logged in Successfully", token: auth_token };

  res.send({ success });
};
