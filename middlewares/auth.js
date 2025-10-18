import {clerkClient} from "@clerk/express";

export const isAdmin = async (req, res, next) => {
  try {
    const {userId} = req.auth();
    if (!userId) {
      return res.status(401).json({message: "Unauthorized"});
    }
    const user = await clerkClient.users.getUser(userId);
    if (user.privateMetadata.role === "admin") {
      return next();
    }
    return res.status(403).json({message: "Access denied : Admins only"});
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({message: "Server error during admin check."});
  }
};
