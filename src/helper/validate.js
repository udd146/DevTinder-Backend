const validator = require('validator')
const bcrypt = require('bcrypt')
const UserModel = require('../Schema/UserSchema')

const validate = async (req) => {
    const { email, password } = req.body;
  
    const user = await UserModel.findOne({ email });
    console.log(user, "User data");
  
    if (!user) throw new Error("Invalid Credential");
  
    if (!validator.isEmail(email)) throw new Error("Invalid Email Id");
  
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid Credential");
  
    return true;
  };

module.exports = {
    validate
}