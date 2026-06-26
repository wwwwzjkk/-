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
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            alert("已收到您的咨询信息，我们会尽快与您联系。");
            form.reset();
        });
    }
});
