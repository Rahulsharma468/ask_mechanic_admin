import connectDB from "@/config/mongodb";
import User from "@/models/users";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const suspended = searchParams.get("suspended");
    const name = searchParams.get("name");

    // Build filters dynamically based on query parameters
    const filters = {};
    if (suspended) {
      filters.suspended = suspended === "true";
    }

    if (name) {
      filters.fixitName = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    const allUsers = await User.find(filters);

    return NextResponse.json(
      { message: "Data Fetched Successfully", data: allUsers },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Data Fetch Failed", error: err.message },
      { status: 400 }
    );
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const userData = await req.json();
    const newUser = new User(userData);
    await newUser.save();

    return NextResponse.json(
      { message: "User Created Successfully", data: newUser },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "User Creation Failed", error: err.message },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const { userId, updates } = await req.json(); // Parse the request body to get the userId and updates

    // Validate if the userId and updates are provided
    if (!userId || !updates) {
      return NextResponse.json(
        { message: "User ID and updates are required" },
        { status: 400 }
      );
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User Updated Successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "User Update Failed", error: err.message },
      { status: 400 }
    );
  }
}