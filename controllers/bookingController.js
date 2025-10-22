import {sendBookingEmail} from "../utils/sendEmail.js";
import Show from "../models/Show.js";
import booking from "../models/booking.js";
import User from "../models/User.js";

// get my bookings
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({success: false, message: "Unauthorized"});

    // populate only 'show' because your Show schema does not have 'movie'
    const bookings = await booking
      .find({user: userId})
      .populate({
        path: "show",
        model: "Show",
        select: "title poster runtime showDateTime", // only these fields
      })
      .sort({createdAt: -1});

    res.json({success: true, bookings});
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({success: false, message: "Server error"});
  }
};

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await booking
      .find()
      .populate({
        path: "user",
        model: "User",
        select: "name email",
      })
      .populate({
        path: "show",
        model: "Show",
        select: "title ",
      })
      .sort({createdAt: -1});

    res.status(200).json({success: true, bookings});
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({success: false, message: "Server error"});
  }
};
