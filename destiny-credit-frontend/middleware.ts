import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api")) {
    const allowedIps = [
      "196.201.214.200",
      "196.201.214.206",
      "196.201.213.114",
      "196.201.214.207",
      "196.201.214.208",
      "196.201.213.44",
      "196.201.212.127",
      "196.201.212.138",
      "196.201.212.129",
      "196.201.212.136",
      "196.201.212.74",
      "196.201.212.69",
      "76.76.21.9",
      "76.76.21.93",
      "76.76.21.241",
    ];
    // const ip = req.headers['x-forwarded-for'];
    const ip = req.ip;

    console.log("ip: " + ip);

    if (ip === undefined) return NextResponse.next();

    if (!allowedIps.includes(ip)) {
      const url = req.nextUrl.clone();

      if (
        url.pathname.startsWith("/favicon") ||
        url.pathname.startsWith("/img")
      ) {
        return NextResponse.next();
      }
      url.pathname = "/api/hello";
      const res = NextResponse.rewrite(url);
      return res;
    }
    return NextResponse.next();
  }
}
