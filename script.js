const form = document.getElementById("contactForm");
const messageBox = document.getElementById("form-message");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  messageBox.className = "form-message";
messageBox.textContent = "";

  const submitButton = form.querySelector("button");
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

 const turnstileToken = document.querySelector(
  '[name="cf-turnstile-response"]'
)?.value;

const formData = {
  name: form.name.value.trim(),
  email: form.email.value.trim(),
  subject: form.subject.value.trim(),
  message: form.message.value.trim(),
  turnstileToken,
};

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      messageBox.className = "form-message success";
messageBox.textContent =
  "✓ Thank you! Your message has been sent successfully. I'll get back to you as soon as possible.";
      form.reset();
   } else {
  messageBox.className = "form-message error";
  messageBox.textContent =
    result.error || "Something went wrong. Please try again.";
}
  } catch (error) {
    messageBox.className = "form-message error";
messageBox.textContent =
  "Something went wrong. Please try again later.";
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});