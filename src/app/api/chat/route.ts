import { NextResponse } from "next/server";
import { runCommerceAgent } from "@/lib/agent";
import { parseChatRequest } from "@/lib/chat-validation";
import type { ChatErrorResponse } from "@/lib/chat-contract";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = parseChatRequest(body);

    if (!parsed.ok) {
      return NextResponse.json<ChatErrorResponse>(
        { error: parsed.error },
        { status: 400 },
      );
    }

    const result = await runCommerceAgent(parsed.data);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json<ChatErrorResponse>(
      {
        error: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}
