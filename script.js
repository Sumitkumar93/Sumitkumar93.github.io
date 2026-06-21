document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon between bars and times (close)
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Sticky Navbar on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(11, 11, 26, 0.95)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(11, 11, 26, 0.8)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = mobileMenuBtn.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }

                // Scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // --- Contact Form Integration with FormSubmit ---

    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const mobile = document.getElementById('contact-mobile').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            // 1. Validation
            let isValid = true;
            let errorMessage = "";

            if (!name) {
                isValid = false;
                errorMessage = "Please enter your name.";
            } else if (!/^[0-9]{10,15}$/.test(mobile.replace(/[\s\-\+]/g, ''))) {
                isValid = false;
                errorMessage = "Please enter a valid mobile number.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                isValid = false;
                errorMessage = "Please enter a valid email address.";
            } else if (!message) {
                isValid = false;
                errorMessage = "Please enter your query message.";
            }

            if (!isValid) {
                formStatus.textContent = errorMessage;
                formStatus.className = "form-status error";
                return;
            }

            // Submit button loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = 'SENDING... <i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            formStatus.textContent = "";

            try {
                // 2. Send via FormSubmit
                const response = await fetch("https://formsubmit.co/ajax/support@ligerelevator.com", {
                    method: "POST",
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        "Name": name,
                        "Mobile Number": mobile,
                        "Email Address": email,
                        "Query Message": message,
                        "Submission Date & Time": new Date().toLocaleString()
                    })
                });

                if (response.ok) {
                    // 3. Show Success Message
                    formStatus.textContent = "Thank you! We have received your query and will contact you shortly.";
                    formStatus.className = "form-status success";
                    contactForm.reset();
                } else {
                    throw new Error("Network response was not ok.");
                }

            } catch (error) {
                console.error("Error submitting form: ", error);
                formStatus.textContent = "An error occurred while sending your message. Please try again later.";
                formStatus.className = "form-status error";
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
                
                // Clear success message after 8 seconds
                setTimeout(() => {
                    formStatus.textContent = "";
                    formStatus.className = "form-status";
                }, 8000);
            }
        });
    }
});
