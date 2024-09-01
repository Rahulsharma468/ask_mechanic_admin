import connectDB from "@/config/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function PUT(req) {
  try {
    await connectDB();
    const { userId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Toggle the suspended status
    user.suspended = !user.suspended;
    await user.save();

    return NextResponse.json(
      { message: "User status updated successfully", data: user },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to update user status", data: err },
      { status: 400 }
    );
  }
}
