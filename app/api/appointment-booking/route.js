import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

async function sendBookingSMS({ name, mobile, category, date, timeSlot }) {
  try {
    // const apikey = process.env.COMMNESTSMS_API_KEY;
    // const sender = process.env.COMMNESTSMS_SENDER || "S1AMA1";

    // const message = `Hi ${name}, your ${category} appointment request at SIAMA is confirmed for ${date} at ${timeSlot}. We will contact you shortly.`;

    // const url = `http://www.commnestsms.com/api/push.json?apikey=${apikey}&route=transactional&sender=${sender}&mobileno=${mobile}&text=${encodeURIComponent(
    //   message
    // )}`;
      const apikey = process.env.COMMNESTSMS_API_KEY;
    const sender = process.env.COMMNESTSMS_SENDER || "S1AMA1";

    const message =
     `Hi ${name}, Your appointment has been booked successfully with Siama Skincare.\n` +
  "We look forward to serving you.\n" +
  "If you have any query, please call us on 8287795045";
    const smsUrl = `http://www.commnestsms.com/api/push.json?apikey=${apikey}&route=transactional&sender=${sender}&mobileno=${mobile}&text=${encodeURIComponent(
      message
    )}`;

    const res = await fetch(smsUrl, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);

    return {
      success: true,
      smsResponse: data,
    };
  } catch (error) {
    console.error("SMS send error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      category = "",
      concern = "",
      name = "",
      mobile = "",
      date = "",
      timeSlot = "",
    } = body;

    // Validation
    if (!["dentist", "dermat"].includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category selected." },
        { status: 400 }
      );
    }

    if (!name.trim()) {
      return NextResponse.json(
        { success: false, message: "Name is required." },
        { status: 400 }
      );
    }

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return NextResponse.json(
        { success: false, message: "Invalid mobile number." },
        { status: 400 }
      );
    }

    if (!date) {
      return NextResponse.json(
        { success: false, message: "Appointment date is required." },
        { status: 400 }
      );
    }

    if (!timeSlot) {
      return NextResponse.json(
        { success: false, message: "Time slot is required." },
        { status: 400 }
      );
    }

    // Optional: prevent duplicate same slot booking for same category/date/time
    const existingBooking = await Appointment.findOne({
      category,
      date,
      timeSlot,
      mobile,
    });

    if (existingBooking) {
      return NextResponse.json(
        {
          success: false,
          message: "You have already submitted this appointment request.",
        },
        { status: 409 }
      );
    }

    // Save booking
    const appointment = await Appointment.create({
      category,
      concern,
      name: name.trim(),
      mobile,
      date,
      timeSlot,
      status: "pending",
    });

    // Send SMS after save
    const smsResult = await sendBookingSMS({
      name: name.trim(),
      mobile,
      category,
      date,
      timeSlot,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Appointment booked successfully.",
        booking: {
          id: appointment._id,
          category: appointment.category,
          name: appointment.name,
          mobile: appointment.mobile,
          date: appointment.date,
          timeSlot: appointment.timeSlot,
          status: appointment.status,
        },
        smsSent: smsResult.success,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Appointment booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong while booking appointment.",
      },
      { status: 500 }
    );
  }
}