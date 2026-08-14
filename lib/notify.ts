/**
 * Best-effort notifications for new contact-form submissions. Every submission
 * is always stored in the database (the admin "Сообщения" inbox); these
 * notifications are extra and never block or fail the form.
 *
 * - Telegram: works out of the box using the existing bot
 *   (TELEGRAM_BOT_TOKEN + ALLOWED_TELEGRAM_ID). No extra setup.
 * - Email: sent via Resend when RESEND_API_KEY is set. Recipient is
 *   NOTIFY_EMAIL (defaults to hamid.kazimov96@gmail.com).
 */

const DEFAULT_NOTIFY_EMAIL = "hamid.kazimov96@gmail.com";

interface Submission {
  name: string;
  email: string;
  message: string;
}

async function notifyTelegram(sub: Submission): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.ALLOWED_TELEGRAM_ID;
  if (!token || !chatId) return;

  const text =
    `📬 Новая заявка с сайта\n\n` +
    `Имя: ${sub.name}\n` +
    `Email: ${sub.email}\n\n` +
    `${sub.message}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}

async function notifyEmail(sub: Submission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL;
  // Without a verified domain, Resend only allows the onboarding sender.
  const from = process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>";

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: sub.email,
      subject: `Новая заявка с сайта — ${sub.name}`,
      text: `Имя: ${sub.name}\nEmail: ${sub.email}\n\n${sub.message}`,
    }),
  });
}

/** Fires all configured notifications; individual failures are swallowed. */
export async function notifyNewSubmission(sub: Submission): Promise<void> {
  const results = await Promise.allSettled([
    notifyTelegram(sub),
    notifyEmail(sub),
  ]);
  for (const r of results) {
    if (r.status === "rejected") {
      console.error("Notification failed:", r.reason);
    }
  }
}
