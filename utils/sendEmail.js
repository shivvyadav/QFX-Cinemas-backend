import nodemailer from "nodemailer";

export const sendBookingEmail = async (userEmail, bookingData) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your app password
      },
    });

    const {movieTitle, poster, date, time, seats, totalAmount, paymentMethod} = bookingData;

    const formattedSeats = seats.join(", ");

    const mailOptions = {
      from: `"QFX Cinemas" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🎬 Your QFX Booking Confirmation – ${movieTitle}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;background:#f7f7f7;padding:30px;">
          <div style="max-width:600px;margin:auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 10px rgba(0,0,0,0.1)">
            
            <!-- Header -->
            <div style="background:#e50914;padding:20px;text-align:center;color:white;">
              <img src="https://upload.wikimedia.org/wikipedia/en/c/cd/QFX_Cinemas_Logo.png" alt="QFX Logo" style="width:100px;margin-bottom:8px;" />
              <h2 style="margin:0;font-size:22px;">Booking Confirmed!</h2>
              <p style="margin:0;font-size:14px;">Thank you for choosing QFX Cinemas 🍿</p>
            </div>

            <!-- Movie Poster -->
            <div style="text-align:center;padding:16px;">
              <img src="${poster}" alt="${movieTitle}" style="width:100%;max-height:300px;object-fit:cover;border-radius:10px;" />
            </div>

            <!-- Booking Details -->
            <div style="padding:20px;">
              <h3 style="color:#e50914;margin-bottom:8px;">🎬 ${movieTitle}</h3>
              <table style="width:100%;border-collapse:collapse;font-size:15px;">
                <tr>
                  <td style="padding:6px 0;"><strong>Date:</strong></td>
                  <td style="text-align:right;">${date}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;"><strong>Time:</strong></td>
                  <td style="text-align:right;">${time}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;"><strong>Seats:</strong></td>
                  <td style="text-align:right;">${formattedSeats}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;"><strong>Payment Method:</strong></td>
                  <td style="text-align:right;text-transform:capitalize;">${paymentMethod}</td>
                </tr>
                <tr style="border-top:1px solid #eee;">
                  <td style="padding:10px 0;font-size:16px;"><strong>Total Amount:</strong></td>
                  <td style="text-align:right;font-size:16px;font-weight:bold;color:#e50914;">Rs. ${totalAmount}</td>
                </tr>
              </table>
            </div>

            <!-- Divider -->
            <div style="border-top:1px dashed #ccc;margin:0 20px;"></div>

            <!-- Footer -->
            <div style="padding:20px;text-align:center;font-size:14px;color:#555;">
              <p>📍 Present this email at the QFX counter or scan your ticket QR (coming soon!)</p>
              <p>Enjoy your movie experience with <strong>QFX Cinemas</strong>!</p>
              <p style="margin-top:16px;color:#aaa;">© ${new Date().getFullYear()} QFX Cinemas Nepal</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    // console.log("✅ QFX Booking email sent successfully");
  } catch (error) {
    console.error("❌ Error sending QFX booking email:", error);
  }
};
