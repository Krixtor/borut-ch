export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    const { name, email, subject, message } = data;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return Response.json(
        { success: false, error: "Missing required fields." },
        { status: 400 }
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