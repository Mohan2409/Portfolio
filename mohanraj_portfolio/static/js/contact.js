document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const toast = document.getElementById("successToast");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const res = await fetch("/contact", {
                method: "POST",
                body: formData
            });

            const data = await res.json();

            if (data.status === "success") {
                form.reset();
                toast.classList.add("show");

                setTimeout(() => {
                    toast.classList.remove("show");
                }, 3000);
            }
        } catch (err) {
            console.error("Contact form error:", err);
        }
    });
});