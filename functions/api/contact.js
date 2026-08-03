export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    const {
  name,
  email,
  subject,
  message,
  turnstileToken,
} = data;

    // Basic validation
    if (
  !name ||
  !email ||
  !subject ||
  !message ||
  !turnstileToken
) {
      return Response.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
      );
    }
const ip =
  request.headers.get("CF-Connecting-IP") ?? "";

const verifyResponse = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: ip,
    }),
  }
);

const verification = await verifyResponse.json();

if (!verification.success) {
  return Response.json(
    {
      success: false,
      error: "Security verification failed. Please try again.",
    },
    {
      status: 400,
    }
  );
}
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "borut.ch <contact@borut.ch>",
        to: ["contact@borut.ch"], // <-- change if you want another address
        reply_to: email,
        subject: `[borut.ch] ${subject}`,
        text: `
New message from borut.ch

Name: ${name}
Email: ${email}

Message:

${message}
`,
      }),
    });

    if (!resendResponse.ok) {
      const error = await resendResponse.text();

      return Response.json(
        {
          success: false,
          error,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json({
      success: true,
    });
  } catch (err) {
    return Response.json(
      {
        success: false,
        error: err.message,
      },
      {
        status: 500,
      }
    );
  }
}