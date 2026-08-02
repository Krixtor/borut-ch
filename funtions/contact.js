export async function onRequestPost(context) {
  try {
    const form = await context.request.formData();

    const name = form.get("name");
    const email = form.get("email");
    const subject = form.get("subject");
    const message = form.get("message");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "borut@borut.ch",
        to: ["borut@borut.ch"],
        reply_to: email,
        subject: `Website contact: ${subject}`,
        html: `
          <h2>New message from borut.ch</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr>
          <p>${message}</p>
        `,
      }),
    });

    if (!response.ok) {
      return new Response(await response.text(), { status: 500 });
    }

    return new Response("OK");
  } catch (err) {
    return new Response(err.message, { status: 500 });
  }
}