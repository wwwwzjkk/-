const CONTACT_API_URL = "https://haoliu-contact.2535958927.workers.dev/";

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.querySelector(".nav-menu");
    if (toggle && menu) {
        toggle.addEventListener("click", () => menu.classList.toggle("open"));
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", async (event) => {
            event.preventDefault();

            if (!CONTACT_API_URL) {
                alert("咨询提交通道尚未配置，请先部署中转接口。");
                return;
            }

            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton ? submitButton.textContent : "";
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "提交中...";
            }

            const formData = new FormData(form);
            const payload = {
                name: String(formData.get("name") || "").trim(),
                company: String(formData.get("company") || "").trim(),
                phone: String(formData.get("phone") || "").trim(),
                message: String(formData.get("message") || "").trim(),
                page: window.location.href,
            };

            try {
                const response = await fetch(CONTACT_API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const result = await response.json().catch(() => ({}));
                if (result.errcode && result.errcode !== 0) {
                    throw new Error(result.errmsg || "企微机器人发送失败");
                }

                alert("已收到您的咨询信息，我们会尽快与您联系。");
                form.reset();
            } catch (error) {
                console.error("Contact form submit failed:", error);
                alert("提交失败，请稍后重试或直接通过电话/邮箱联系。");
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                }
            }
        });
    }
});
