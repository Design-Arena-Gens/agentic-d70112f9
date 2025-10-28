import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureAutoReplyConfig } from "@/lib/autoReply";
import LogoutButton from "@/components/LogoutButton";
import AutoReplyForm from "@/components/dashboard/AutoReplyForm";
import RunNowCard from "@/components/dashboard/RunNowCard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/");
  }

  const config = await ensureAutoReplyConfig(session.user.id);

  const slackConfigured = Boolean(process.env.SLACK_WEBHOOK_URL);

  return (
    <main className="container flex flex-col gap-10 py-12">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">Signed in as</p>
          <h1 className="text-3xl font-semibold text-white">{session.user.email}</h1>
        </div>
        <LogoutButton />
      </header>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AutoReplyForm config={config} slackConfigured={slackConfigured} />
        </div>
        <div className="lg:col-span-1">
          <RunNowCard />
        </div>
      </section>
    </main>
  );
}
