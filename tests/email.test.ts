import { createReplyMessage } from "@/lib/email";

describe("createReplyMessage", () => {
  it("encodes a valid reply payload including metadata", () => {
    const raw = createReplyMessage({
      to: "example@acme.com",
      subject: "Re: Inquiry",
      replyBody: "Hello there!",
      messageId: "<message-id>",
      includeOriginalThread: true,
      originalSnippet: "Need details"
    });

    const decoded = Buffer.from(raw, "base64url").toString("utf-8");

    expect(decoded).toContain("To: example@acme.com");
    expect(decoded).toContain("Subject: Re: Inquiry");
    expect(decoded).toContain("In-Reply-To: <message-id>");
    expect(decoded).toContain("Hello there!");
    expect(decoded).toContain("Need details");
  });
});
