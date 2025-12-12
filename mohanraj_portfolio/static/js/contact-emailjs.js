// static/js/contact-emailjs.js

// load EmailJS (if using CDN include the script tag in your HTML too — shown below)
(function () {
  // Ensure emailjs is available
  if (!window.emailjs) {
    console.warn("EmailJS SDK not found. Make sure you included the CDN script.");
    return;
  }

  // init with your user / public key
  emailjs.init("LChNnI1fz4hm-1_oW"); // <-- REPLACE with your EmailJS user ID (user_xxx)

  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("contact-submit");
  const feedback = document.getElementById("contact-feedback");

  function showFeedback(message, ok = true) {
    feedback.textContent = message;
    feedback.style.color = ok ? "#b8ffcc" : "#ffb3b3";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Basic form validation
    if (!form.user_name.value.trim() || !form.user_email.value.trim() || !form.user_message.value.trim()) {
      showFeedback("Please fill name, email and message.", false);
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    showFeedback("Sending message…");

    // Use sendForm — it grabs input[name] fields automatically
    emailjs
      .sendForm("service_yl2pqeh", "template_hs5f0v9", form) // <-- REPLACE service & template
      .then(function (response) {
        // success
        showFeedback("Message sent — I will reply to you soon. Thank you!");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      })
      .catch(function (err) {
        console.error("EmailJS error:", err);
        showFeedback("Sorry — something went wrong. Try again or email me directly.", false);
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      });
  });
})();
