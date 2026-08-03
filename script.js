const form = document.getElementById("contactForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = form.querySelector("button");
  const originalButtonText = submitButton.textContent;

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  const formData = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    message: form.message.value.trim(),
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
      alert("✅ Thank you! Your message has been sent.");
      form.reset();
    } else {
      alert(`❌ ${result.error}`);
    }
  } catch (error) {
    alert("❌ Something went wrong. Please try again later.");
    console.error(error);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
});