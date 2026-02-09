// Middleware - can be used for other purposes
// Rate limiting is now handled in NextAuth authorize function
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Add any middleware logic here if needed
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
