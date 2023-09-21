exports.getNewPassword = (req,res,next)=>{

const token = req.params.token;
User.findOne({resetToken: token,
   resetTokenExpiration:{$gt: Date.now()}})
.then(user => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/new-password", {
    path: "/new-password",
    pageTitle: "New Password",
    errorMessage: message,
    userId : user._id.toString(),
    passwordToken: token,
  });
})
.catch(err =>{
  console.log(err);
});

}

exports.postNewPassword = (req,res,next)=>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser ;

  User.findOne({resetToken: passwordToken,
    resetTokenExpiration:{$gt: Date.now()}, 
    _id: userId
 }).then(user => {
  resetUser = user;
    return bcrypt.hash(newPassword,12);
 }).then(hashedPassword =>{
    // console.log(hashedPassword)
      resetUser.password = hashedPassword;
      console.log( resetUser.password);
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration= undefined;
     return resetUser.save();
 }).then(result => {
  res.redirect('/login');
 })
 .catch(err =>{
  console.log(err);
 })
}
