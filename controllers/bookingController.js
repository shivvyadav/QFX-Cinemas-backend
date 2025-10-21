import {sendBookingEmail} from "../utils/sendEmail.js";
import Show from "../models/Show.js";
import booking from "../models/booking.js";
import User from "../models/User.js";

export const createBooking = async (req, res) => {
  try {
    const userId = req.auth().userId;
    const {show, seats, totalAmount, paymentMethod, date, time} = req.body;

    if (!userId) return res.status(401).json({success: false, message: "Unauthorized"});

    const foundShow = await Show.findById(show);
    if (!foundShow) return res.status(404).json({success: false, message: "Show not found"});

    // Create booking
    const newBooking = new booking({
      user: userId,
      show,
      seats,
      totalAmount,
      paymentMethod,
      date,
      time,
      bookingStatus: "active",
    });

    await newBooking.save();

    // Update occupied seats
    if (!foundShow.occupiedSeats.has(date)) {
      foundShow.occupiedSeats.set(date, new Map());
    }
    const dateMap = foundShow.occupiedSeats.get(date);
    const currentSeats = dateMap.get(time) || [];
    dateMap.set(time, [...new Set([...currentSeats, ...seats])]);
    foundShow.occupiedSeats.set(date, dateMap);

    await foundShow.save();

    // Fetch user email
    const user = await User.findById(userId);
    if (user?.email) {
      await sendBookingEmail(user.email, {
        movieTitle: foundShow.title,
        poster: foundShow.poster,
        date,
        time,
        seats,
        totalAmount,
        paymentMethod,
      });
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully!",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({success: false, message: "Server error"});
  }
};

// get my bookings
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({success: false, message: "Unauthorized"});

    // populate only 'show' because your Show schema does not have 'movie'
    const bookings = await booking.find({user: userId}).populate({
      path: "show",
      model: "Show",
      select: "title poster runtime showDateTime", // only these fields
    });

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
