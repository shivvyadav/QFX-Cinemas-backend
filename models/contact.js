import {mongoose} from "mongoose";
import User from "./User.js";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      ref: "User",
    },
  },
  {timestamps: true}
);

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;
