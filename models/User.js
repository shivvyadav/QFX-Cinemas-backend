import mongoose from "mongoose";

const {Schema, model} = mongoose;

const userSchema = new Schema(
  {
    _id: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String, required: true},
  },
  {timestamps: true}
);

const User = mongoose.models.User || model("User", userSchema);
export default User;
