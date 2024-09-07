import connectDB from '@/config/mongodb';
import Admin from '@/models/admin';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET;

export async function POST(req) {
  try {
    await connectDB();

    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Username and password are required.' },
        { status: 400 }
      );
    }

    // Find the admin user by username
    const admin = await Admin.findOne({ username });

    console.log(admin);

    if (!admin) {
      return NextResponse.json(
        { message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid username or password.' },
        { status: 401 }
      );
    }

    // Generate a JWT token
    const token = jwt.sign({ id: admin._id, username: admin.username }, JWT_SECRET, {
      expiresIn: '1h', // Token expiration time
    });

    // Successful login
    return NextResponse.json(
      { message: 'Login successful', token }, // Include the token in the response
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Server error', error: err.message },
      { status: 500 }
    );
  }
}