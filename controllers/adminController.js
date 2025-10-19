import User from "../models/User.js";
import Show from "../models/Show.js";
import booking from "../models/booking.js";
// check if current user is admin
export const VerifyAdmin = async (req, res) => {
  res.json({success: true, message: "Welcome Admin"});
};

export const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMovies = await Show.countDocuments();
    const totalBookings = await booking.countDocuments();

    // Aggregate total earnings from all bookings
    const earningsData = await booking.aggregate([
      {$group: {_id: null, totalEarnings: {$sum: "$totalAmount"}}},
    ]);

    const totalEarnings = earningsData[0]?.totalEarnings || 0;

    res.status(200).json({
      success: true,
      summary: {
        totalUsers,
        totalMovies,
        totalBookings,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error("Error fetching admin summary:", error);
    res.status(500).json({success: false, message: "Server error"});
  }
};
