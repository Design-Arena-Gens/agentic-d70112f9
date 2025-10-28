import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { authOptions } from "@/lib/auth";
import LoginButton from "@/components/LoginButton";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <main className="container flex flex-1 flex-col items-center justify-center gap-12 py-20 text-center">
      <div className="max-w-2xl space-y-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-xs uppercase tracking-wide text-slate-400">
          Smart Inbox Automation
        </span>
        <h1 className="text-4xl font-bold md:text-6xl">
          Connect Gmail and respond instantly with an intelligent auto-reply copilot.
        </h1>
        <p className="text-lg text-slate-300">
          Authenticate securely with Google, configure adaptive responder rules, and notify your
          team on Slack whenever your digital assistant takes action.
        </p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <LoginButton />
        <Link
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-slate-200"
          href="#features"
        >
          Explore features <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <section id="features" className="mx-auto grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-left shadow-xl">
          <h2 className="text-xl font-semibold">Contextual responses</h2>
          <p className="mt-2 text-sm text-slate-400">
            Target specific conversations using keyword matching and keep threads clean with smart
            labels.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-left shadow-xl">
          <h2 className="text-xl font-semibold">Slack signal boosts</h2>
          <p className="mt-2 text-sm text-slate-400">
            Send rich summaries to Slack when an auto-reply is delivered so teammates never miss an
            important touchpoint.
          </p>
        </article>
        <article className="rounded-2xl border border-slate-800/60 bg-slate-900/60 p-6 text-left shadow-xl">
          <h2 className="text-xl font-semibold">Security-first</h2>
          <p className="mt-2 text-sm text-slate-400">
            OAuth 2.0 with granular Gmail scopes, encrypted token storage, and auditable activity
            logs.
          </p>
        </article>
      </section>
    </main>
  );
}
