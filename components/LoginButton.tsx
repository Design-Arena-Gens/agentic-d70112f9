"use client";

import { signIn } from "next-auth/react";

export default function LoginButton() {
  return (
    <button
      type="button"
      onClick={() => signIn("google")}
      className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition hover:bg-blue-500"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 48 48"
        className="h-5 w-5"
        aria-hidden
      >
        <path
          fill="#4285F4"
          d="M24 9.5c3.54 0 6 1.54 7.38 2.83l5.42-5.42C33.12 3.42 28.88 1.5 24 1.5 14.64 1.5 6.6 6.98 2.88 14.44l6.46 5.02C10.6 13.02 16.71 9.5 24 9.5z"
        />
        <path
          fill="#34A853"
          d="M46.5 24.5c0-1.52-.14-2.98-.41-4.39H24v8.32h12.7c-.55 2.77-2.23 5.12-4.76 6.69l7.3 5.67C43.52 37.19 46.5 31.31 46.5 24.5z"
        />
        <path
          fill="#FBBC05"
          d="M9.34 28.96C8.38 26.48 7.88 23.8 7.88 21c0-2.8.5-5.48 1.46-7.96l-6.46-5.02C1.74 11.21 0 17.36 0 24s1.74 12.79 4.88 17.98l6.46-5.02z"
        />
        <path
          fill="#EA4335"
          d="M24 46.5c6.48 0 11.91-2.14 15.87-5.81l-7.3-5.67c-2.03 1.37-4.64 2.17-8.57 2.17-6.09 0-11.27-4.1-13.12-9.63l-6.46 5.02C6.6 41.02 14.64 46.5 24 46.5z"
        />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      Sign in with Google
    </button>
  );
}
