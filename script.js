// FAQ 交互
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // 关闭所有其他FAQ
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // 切换当前FAQ
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 表单提交
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('感谢您的咨询！我们会尽快与您联系。');
            contactForm.reset();
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
