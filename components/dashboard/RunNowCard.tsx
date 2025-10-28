"use client";

import { useState, useTransition } from "react";

type Summary = {
  processed: number;
  skipped: number;
  slackNotifications: number;
  errors: Array<{ messageId: string; reason: string }>;
};

export default function RunNowCard() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onRun = () => {
    setError(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/auto-reply/run", {
          method: "POST"
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.error ?? "Unable to execute auto reply");
        }

        const data = (await response.json()) as Summary;
        setSummary(data);
      } catch (err) {
        const errorObject = err as Error;
        setError(errorObject.message);
      }
    });
  };

  return (
    <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white">Run auto reply</h2>
      <p className="text-sm text-slate-400">
        Trigger the responder now to sweep the last batch of unread conversations. Suitable for
        manual syncs or cron-based pings.
      </p>
      <button
        type="button"
        onClick={onRun}
        disabled={isPending}
        className="w-full rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {isPending ? "Processing…" : "Run now"}
      </button>

      {summary && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p>
            <span className="text-emerald-400 font-semibold">{summary.processed}</span> replies
            delivered
          </p>
          <p>
            <span className="text-slate-200 font-semibold">{summary.skipped}</span> skipped (already
            handled)
          </p>
          <p>
            <span className="text-sky-300 font-semibold">{summary.slackNotifications}</span> Slack
            pings
          </p>
          {summary.errors.length > 0 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-rose-300">View errors</summary>
              <ul className="mt-2 space-y-1 text-xs text-rose-200">
                {summary.errors.map((item) => (
                  <li key={item.messageId}>
                    {item.messageId}: {item.reason}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-rose-500/50 bg-rose-500/20 px-4 py-2 text-sm text-rose-100">
          {error}
        </p>
      )}

      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-400">
        <p className="font-semibold text-slate-200">Automation tip</p>
        <p className="mt-1">
          Ping this endpoint from a scheduled GitHub Action, Vercel cron job, or Zapier webhook to
          keep your inbox on autopilot.
        </p>
      </div>
    </aside>
  );
}
