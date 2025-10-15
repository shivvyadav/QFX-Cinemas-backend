import mongoose from "mongoose";
const {Schema, model} = mongoose;

const userSchema = new Schema(
  {
    // keep custom _id type (string) if you want predictable IDs,
    // but do NOT add a custom unique/index option on `_id` — MongoDB already
    // creates the _id index and will reject attempts to overwrite it.
    _id: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: true},
    image: {type: String, required: true, default: null},
  },
  {timestamps: true}
);

const User = model("user", userSchema);

export default User;
