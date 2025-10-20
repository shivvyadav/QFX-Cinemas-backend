import cron from "node-cron";
import booking from "../models/booking.js";

cron.schedule("*/60 * * * *", async () => {
  try {
    const activeBookings = await booking.find({bookingStatus: "active"});
    for (const booking of activeBookings) {
      // Combine booking date and time into a Date object
      const showDateTime = new Date(`${booking.date}T${booking.time}`);

      // Check if this date-time is already in the past
      if (!isNaN(showDateTime) && new Date() > showDateTime) {
        booking.bookingStatus = "expired";
        await booking.save();
        // console.log(`✅ Booking ${booking._id} expired.`);
      }
    }
  } catch (error) {
    console.error("❌ Error in booking expiry cron:", error);
  }
});
