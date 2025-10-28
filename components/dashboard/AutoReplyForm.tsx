"use client";

import { useMemo, useState, useTransition } from "react";
import type { AutoReplyConfig } from "@prisma/client";

type Props = {
  config: AutoReplyConfig;
  slackConfigured: boolean;
};

type FormState = {
  enabled: boolean;
  matcher: string;
  replySubject: string;
  replyBody: string;
  includeOriginalThread: boolean;
  sendSlackNotification: boolean;
  slackChannel: string;
};

export default function AutoReplyForm({ config, slackConfigured }: Props) {
  const [form, setForm] = useState<FormState>({
    enabled: config.enabled,
    matcher: config.matcher ?? "",
    replySubject: config.replySubject ?? "",
    replyBody: config.replyBody ?? "",
    includeOriginalThread: config.includeOriginalThread,
    sendSlackNotification: slackConfigured ? config.sendSlackNotification : false,
    slackChannel: config.slackChannel ?? ""
  });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const slackHint = useMemo(() => {
    if (!slackConfigured) {
      return "Add a SLACK_WEBHOOK_URL environment variable to enable Slack notifications.";
    }
    return "Messages are delivered via the configured Slack webhook.";
  }, [slackConfigured]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("saving");
    setErrorMessage(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            slackChannel: form.slackChannel || null
          })
        });

        if (!response.ok) {
          const payload = await response.json();
          throw new Error(payload.error ? JSON.stringify(payload.error) : "Unable to save configuration");
        }

        setStatus("success");
        setTimeout(() => setStatus("idle"), 2000);
      } catch (error) {
        const err = error as Error;
        setErrorMessage(err.message);
        setStatus("error");
      }
    });
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Auto reply playbook</h2>
          <p className="text-sm text-slate-400">
            Tune how your assistant triages inbox traffic and crafts responses.
          </p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(event) => updateField("enabled", event.target.checked)}
          />
          <span className="text-slate-300">Enabled</span>
        </label>
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-200">Subject filter</span>
          <input
            type="text"
            placeholder="e.g. onboarding OR urgent"
            value={form.matcher}
            onChange={(event) => updateField("matcher", event.target.value)}
          />
          <span className="text-xs text-slate-500">
            Gmail search syntax supported. Keep blank to reply to every unread inbox message.
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-200">Reply subject</span>
          <input
            type="text"
            value={form.replySubject}
            onChange={(event) => updateField("replySubject", event.target.value)}
          />
        </label>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-200">Reply message</span>
        <textarea
          rows={6}
          value={form.replyBody}
          onChange={(event) => updateField("replyBody", event.target.value)}
        />
        <span className="text-xs text-slate-500">
          Markdown is supported for bold/italic styling (plain text fallback applied for Gmail).
        </span>
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.includeOriginalThread}
            onChange={(event) => updateField("includeOriginalThread", event.target.checked)}
          />
          Include snippet of original message
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={form.sendSlackNotification && slackConfigured}
            disabled={!slackConfigured}
            onChange={(event) => {
              if (!slackConfigured) return;
              updateField("sendSlackNotification", event.target.checked);
            }}
          />
          Push summary to Slack
        </label>
      </div>

      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-slate-200">Slack channel hint (optional)</span>
        <input
          type="text"
          value={form.slackChannel}
          onChange={(event) => updateField("slackChannel", event.target.value)}
          placeholder="#automations"
          disabled={!slackConfigured}
        />
        <span className="text-xs text-slate-500">{slackHint}</span>
      </label>

      {status === "success" && (
        <p className="rounded-lg border border-emerald-500/40 bg-emerald-500/20 px-4 py-2 text-sm text-emerald-100">
          Configuration saved.
        </p>
      )}
      {status === "error" && errorMessage && (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/20 px-4 py-2 text-sm text-rose-100">
          {errorMessage}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700"
        >
          {isPending ? "Saving…" : "Save configuration"}
        </button>
      </div>
    </form>
  );
}
