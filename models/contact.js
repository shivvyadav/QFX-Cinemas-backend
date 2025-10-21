import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    subject: {type: String, trim: true},
    message: {type: String, required: true},
    owner: {type: String, ref: "User", required: true},
  },
  {timestamps: true}
);

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
