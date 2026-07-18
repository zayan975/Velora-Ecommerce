import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { meService } from "../services/me.service";

export const meController = async () => {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const user = await meService(session.user.id);

  return NextResponse.json({
    success: true,
    user,
  });
};