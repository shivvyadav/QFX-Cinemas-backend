import axios from "axios";
import booking from "../models/booking.js";
import Show from "../models/Show.js";
import User from "../models/User.js";
import {sendBookingEmail} from "../utils/sendEmail.js";

export const createPayment = async (req, res) => {
  try {
    const {amount, orderId} = req.body;
    const response = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/initiate/",
      {
        return_url: `${process.env.CLIENT_URL}/payment/verifyPayment`,
        website_url: process.env.CLIENT_URL,
        amount,
        purchase_order_id: orderId,
        purchase_order_name: "Movie Booking",
      },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (err) {
    console.error("Khalti Initiate Error:", err.response?.data || err.message);
    res.status(500).json({success: false, message: "Failed to initiate Khalti payment"});
  }
};

// verify payment
export const verifyPayment = async (req, res) => {
  console.log(req.body);
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({success: false, message: "Unauthorized"});
    const {pidx, showId, date, time, seats = [], totalAmount} = await req.body;
    const khaltiRes = await axios.post(
      "https://dev.khalti.com/api/v2/epayment/lookup/",
      {pidx},
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (khaltiRes.data.status === "Completed") {
      // Payment success → create booking
      const newBooking = new booking({
        user: req.auth().userId,
        show: showId,
        seats,
        totalAmount: Number(khaltiRes.data.total_amount) / 100 || Number(totalAmount),
        paymentMethod: "khalti",
        date,
        time,
        bookingStatus: "active",
      });

      await newBooking.save();

      // Update occupied seats
      const foundShow = await Show.findById(showId);
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
          paymentMethod: "Khalti",
        });
      }

      return res.json({success: true, booking: newBooking});
    } else {
      return res.status(400).json({success: false, message: "Payment not completed"});
    }
  } catch (err) {
    console.error("Khalti Verification Error:", err.response?.data || err.message);
    res.status(500).json({success: false, message: "Failed to verify payment"});
  }
};
