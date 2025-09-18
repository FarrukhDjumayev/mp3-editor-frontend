import { NextResponse } from "next/server";
import { startBot } from "@/bot/bot";

let botStarted = false;

export async function GET() {
  if (!botStarted) {
    startBot();
    botStarted = true;
  }
  return NextResponse.json({ status: "Bot ishga tushdi ✅" });
}
