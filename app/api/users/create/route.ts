import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { auth } from "@clerk/nextjs/server";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/users/create invoked')
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log('create user body', body)
    const {
      clerkId,
      firstName,
      lastName,
      email,
      phone,
      role
    } = body;

    // Validate required fields
    if (!email || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ["patient", "doctor", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: "Invalid role specified" },
        { status: 400 }
      );
    }

    // Create user profile in Convex
    const createdId = await convex.mutation(api.users.createUser, {
      clerkId,
      email,
      firstName,
      lastName,
      phone,
      role,
      password: ''
    });

    return NextResponse.json({
      success: true,
      message: "User profile created successfully",
      userId: createdId,
    });

  } catch (error) {
    console.error("Error creating user profile:", error);
    return NextResponse.json(
      { error: "Failed to create user profile" },
      { status: 500 }
    );
  }
}