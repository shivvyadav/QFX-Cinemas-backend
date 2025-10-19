// models/Booking.js
import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: true,
    },
    show: {
      type: String,
      ref: "Show",
      required: true,
    },
    seats: {
      type: [String],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["esewa", "khalti", "cash"],
      default: "esewa",
    },
    bookingStatus: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
  },
  {timestamps: true}
);

export default mongoose.model("Booking", bookingSchema);
