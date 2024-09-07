import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // To logout, just send a response indicating to clear the auth token
    return NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: 'Logout failed', error: err.message },
      { status: 500 }
    );
  }
}
