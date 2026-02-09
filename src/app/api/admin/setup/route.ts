import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { validatePassword } from "@/lib/password-validation";

// POST - Setup admin account (first time only)
// Protected by environment variable flag
export async function POST(request: NextRequest) {
  try {
    // Additional protection: require ALLOW_ADMIN_SETUP env variable
    const allowSetup = process.env.ALLOW_ADMIN_SETUP === "true";
    if (!allowSetup) {
      return NextResponse.json(
        { error: "Admin setup is disabled. Set ALLOW_ADMIN_SETUP=true to enable." },
        { status: 403 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await db.admin.findFirst();
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin account already exists" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { username, password, setupToken } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password required" },
        { status: 400 }
      );
    }

    // Validate setup token if provided
    const expectedToken = process.env.ADMIN_SETUP_TOKEN;
    if (expectedToken && setupToken !== expectedToken) {
      return NextResponse.json(
        { error: "Invalid setup token" },
        { status: 401 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { 
          error: "Password does not meet requirements",
          details: passwordValidation.errors
        },
        { status: 400 }
      );
    }

    // Validate username (basic checks)
    if (username.length < 3) {
      return NextResponse.json(
        { error: "Username must be at least 3 characters long" },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, and hyphens" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await db.admin.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully",
    });
  } catch (error) {
    console.error("Error setting up admin:", error);
    return NextResponse.json(
      { error: "Failed to setup admin" },
      { status: 500 }
    );
  }
}
