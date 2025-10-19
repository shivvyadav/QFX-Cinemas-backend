import Contact from "../models/contact.js";

const createContact = async (req, res) => {
  try {
    const {name, email, subject, message} = req.body;
    const userId = req.auth()?.userId;

    if (!userId) {
      return res.status(401).json({message: "You are not signed in"});
    }

    if (!name || !email || !message) {
      return res.status(400).json({message: "Required fields are missing"});
    }

    const contact = new Contact({
      name,
      email,
      subject,
      message,
      owner: userId,
    });

    await contact.save();
    res.status(201).json({message: "Query submitted successfully!"});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Server error"});
  }
};

export default createContact;
