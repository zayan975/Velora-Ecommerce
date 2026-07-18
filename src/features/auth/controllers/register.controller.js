import { NextResponse } from "next/server";
import { registerService } from "../services/register.service";

export const registerController = async (req) => {
  try {
    const body = await req.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required." },
        { status: 400 }
      );
    }

    const user = await registerService({
      name,
      email,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
};