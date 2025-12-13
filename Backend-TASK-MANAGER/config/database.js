const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://vs9917088347_db_user:jtWay9oPgchCGcpe@cluster0.ehwa9qe.mongodb.net/coding_platform?retryWrites=true&w=majority'
    );
    console.log("database connected successfully");
  } catch (err) {
    console.log("database connection failed");
    console.log(err);
  }
};

const userSchema = mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true }, // this is correct
});

const UserModel = mongoose.model('User', userSchema);

module.exports = {
  connectDB,
  UserModel,
};
