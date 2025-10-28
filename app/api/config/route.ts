import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ensureAutoReplyConfig } from "@/lib/autoReply";

const updateSchema = z.object({
  enabled: z.boolean(),
  matcher: z.string().max(200),
  replySubject: z.string().min(1).max(120),
  replyBody: z.string().min(1).max(2000),
  includeOriginalThread: z.boolean(),
  sendSlackNotification: z.boolean(),
  slackChannel: z.string().max(100).nullable().optional()
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const config = await ensureAutoReplyConfig(session.user.id);

  return NextResponse.json(config);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.autoReplyConfig.update({
    where: { userId: session.user.id },
    data: parsed.data
  });

  return NextResponse.json(updated);
}
