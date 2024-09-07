import connectDB from "@/config/mongodb";
import User from "@/models/users";
import Notification from "@/models/notification";
import NotificationMapper from "@/models/notificationMapper";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("searchQuery") || "";
    const status = searchParams.get("status") || "";

    // Fetch notifications (projects)
    const notifications = await Notification.find({
      vehicleProblemDescription: { $regex: searchQuery, $options: "i" },
      ...(status && { status }) // Apply status filter if provided
    });

    // Fetch users for client and service provider details
    const notificationIds = notifications.map((n) => n._id);
    const notificationMappers = await NotificationMapper.find({
      notificationId: { $in: notificationIds }
    }).populate("userId").populate("notificationId");

    const projects = notificationMappers.map((nm) => ({
      project: nm.notificationId,
      serviceProvider: nm.userId,
      didAccept: nm.didAccept,
      currentTime: nm.currentTime
    }));

    return NextResponse.json(
      { message: "Data Fetched Successfully", data: projects },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Data Fetch Failed", error: err.message },
      { status: 400 }
    );
  }
}
