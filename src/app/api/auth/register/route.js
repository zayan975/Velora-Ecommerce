import { NextResponse } from "next/server";
import { registerUser } from "@/features/auth/services/register.service";

export async function POST(request) {
  try {
    const body = await request.json();

    const user = await registerUser(body);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 400 }
    );
  }
}