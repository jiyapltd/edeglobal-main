(function() {
    "use strict";



    // === CONTACT ENDPOINT ===
    // Your VPS Node backend that emails the contact form (POST /api/contact).
    const CONTACT_ENDPOINT = 'https://projects.edeglobal.in/api/contact';

    // --- 1. CANVAS STARFIELD (The Void Effect) ---
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    
    // Configuration
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseDistance = 200;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initCanvas() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animateCanvas();
    }

    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function animateCanvas() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connect particles
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connect to mouse
            if (mouse.x) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    ctx.strokeStyle = `rgba(212, 175, 55, ${1 - distance / mouseDistance})`; // Gold connection
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animateCanvas);
    }

    window.addEventListener('resize', resize);
    initCanvas();


    // --- 2. PRELOADER & INIT ---
    window.addEventListener("load", () => {
        const counter = document.querySelector(".counter");
        const line = document.querySelector(".preloader-line");
        const preloader = document.querySelector(".preloader");
        
        let count = 0;
        const interval = setInterval(() => {
            count++;
            counter.innerText = count < 10 ? `0${count}` : count;
            line.style.width = `${count}%`;
            
            if (count === 100) {
                clearInterval(interval);
                
                // Exit Preloader
                gsap.to(preloader, {
                    yPercent: -100,
                    duration: 1.5,
                    ease: "power4.inOut",
                    onComplete: () => {
                        document.body.classList.remove("is-loading");
                        initHeroAnimations();
                        ScrollTrigger.refresh(); // Ensure positions are correct after load
                    }
                });
            }
        }, 20); // Adjust speed here
    });


    // --- 3. GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    function initHeroAnimations() {
        const tl = gsap.timeline();
        
        // Split text for Hero
        const heroLines = document.querySelectorAll(".hero-title .line");
        
        tl.from(heroLines, {
            y: 100,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power4.out"
        })
        .from(".hero-footer", {
            opacity: 0,
            y: 20,
            duration: 1
        }, "-=1");
    }

    // Horizontal Scroll for Services
    ScrollTrigger.matchMedia({
        // Desktop only
        "(min-width: 769px)": function() {
            const servicesTrack = document.querySelector(".services-track");
            
            // Calculate width
            function getScrollAmount() {
                let servicesWidth = servicesTrack.scrollWidth;
                return -(servicesWidth - window.innerWidth);
            }

            const tween = gsap.to(servicesTrack, {
                x: getScrollAmount,
                duration: 3,
                ease: "none"
            });

            ScrollTrigger.create({
                trigger: ".services-pin-wrap",
                start: "top top",
                end: () => `+=${getScrollAmount() * -1}`,
                pin: true,
                animation: tween,
                scrub: 1,
                invalidateOnRefresh: true
            });
        } 
    });

    // Text Reveals (SplitType)
    // Note: SplitType is loaded via CDN. We wait for it.
    setTimeout(() => {
        if (window.SplitType) {
            const splitTypes = document.querySelectorAll('.split-text');
            splitTypes.forEach(char => {
                const text = new SplitType(char, { types: 'lines, words' });
                
                gsap.from(text.lines, {
                    scrollTrigger: {
                        trigger: char,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: false
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.1,
                    ease: 'power3.out'
                });
            });
        }
    }, 1000);


    // --- 4. CUSTOM CURSOR ---
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorFollower = document.querySelector(".cursor-follower");

    window.addEventListener("mousemove", (e) => {
        gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0 });
        gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.15 });
    });

    // Hover States
    const hoverTargets = document.querySelectorAll("a, button, .service-card, .slider-handle");
    hoverTargets.forEach(el => {
        el.addEventListener("mouseenter", () => cursorFollower.classList.add("active"));
        el.addEventListener("mouseleave", () => cursorFollower.classList.remove("active"));
    });


    // --- 5. STICKY STACK ANIMATIONS ---
    // Sticky Stack Services
    // The CSS 'position: sticky' handles the stacking visually.
    // We can add a scale effect to the cards as they scroll away.
    const cards = document.querySelectorAll(".sticky-card");
    
    cards.forEach((card, index) => {
        gsap.to(card.querySelector(".card-inner"), {
            scale: 0.9,
            opacity: 0.8,
            scrollTrigger: {
                trigger: card,
                start: "top 15%", // When card hits the sticky top
                end: "bottom 15%",
                scrub: true,
                toggleActions: "play none none reverse"
            }
        });
    });



    // --- 7. MENU OVERLAY ---
    const menuBtn = document.querySelector(".menu-btn");
    const menuOverlay = document.querySelector(".menu-overlay");
    const menuLinks = document.querySelectorAll(".menu-link");
    let isMenuOpen = false;

    menuBtn.addEventListener("click", () => {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            menuOverlay.classList.add("active");
            // Animate links in
            gsap.fromTo(menuLinks, 
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.3 }
            );
        } else {
            menuOverlay.classList.remove("active");
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener("click", () => {
            isMenuOpen = false;
            menuOverlay.classList.remove("active");
        });
    });


    // --- 4. Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll(".magnetic-btn");

    magneticBtns.forEach(btn => {
        btn.addEventListener("mousemove", (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3, // Magnetic strength
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Move the fill/text slightly more for depth
            gsap.to(btn.querySelector(".btn-text"), {
                x: x * 0.1,
                y: y * 0.1,
                duration: 0.3
            });
        });

        btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
            gsap.to(btn.querySelector(".btn-text"), { x: 0, y: 0, duration: 0.5 });
        });
    });

    // --- 5. Sliding Captcha ---
    const sliderHandle = document.getElementById("slider-handle");
    const sliderContainer = document.getElementById("captcha-container");
    const sliderOverlay = document.getElementById("slider-overlay");
    const submitBtn = document.getElementById("submit-btn");
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let isVerified = false;

    sliderHandle.addEventListener("mousedown", (e) => {
        if (isVerified) return;
        isDragging = true;
        startX = e.clientX;
        sliderContainer.classList.add("active");
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging || isVerified) return;

        const containerRect = sliderContainer.getBoundingClientRect();
        const maxMove = containerRect.width - sliderHandle.offsetWidth - 4; // 4px padding
        
        let moveX = e.clientX - startX;
        
        if (moveX < 0) moveX = 0;
        if (moveX > maxMove) moveX = maxMove;

        currentX = moveX;
        sliderHandle.style.transform = `translateX(${moveX}px)`;
        sliderOverlay.style.width = `${moveX + 20}px`; // Visual fill

        // Check if completed
        if (moveX >= maxMove - 5) {
            verifyCaptcha();
        }
    });

    window.addEventListener("mouseup", () => {
        if (!isDragging || isVerified) return;
        isDragging = false;
        
        // Reset if not verified
        if (!isVerified) {
            gsap.to(sliderHandle, { x: 0, duration: 0.5, ease: "power2.out" });
            gsap.to(sliderOverlay, { width: 0, duration: 0.5 });
            sliderHandle.style.transform = "translateX(0px)"; // Fallback
        }
    });

    function verifyCaptcha() {
        isVerified = true;
        isDragging = false;
        sliderContainer.classList.add("verified");
        submitBtn.removeAttribute("disabled");
        
        // Visual success feedback
        gsap.to(sliderHandle, { 
            backgroundColor: "#4CAF50",
            duration: 0.3 
        });
        sliderHandle.innerHTML = "✓";
    }

    const form = document.getElementById("omega-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!isVerified) {
            alert("Please complete the security check.");
            return;
        }

        const btnText = submitBtn.querySelector(".btn-text");
        const originalText = btnText.innerText;

        btnText.innerText = "Sending...";

        const fd = new FormData(form);
        const payload = {
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            service: fd.get("service"),
            subject: fd.get("subject"),
            message: fd.get("message")
        };

        try {
            const res = await fetch(CONTACT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await res.json().catch(() => ({}));

            if (res.ok) {
                btnText.innerText = "Message Sent";
                submitBtn.style.backgroundColor = "#4CAF50";
                submitBtn.style.borderColor = "#4CAF50";
                submitBtn.style.color = "#fff";
                form.reset();

                setTimeout(() => {
                    isVerified = false;
                    sliderContainer.classList.remove("verified");
                    sliderHandle.style.transform = "translateX(0)";
                    sliderOverlay.style.width = "0";
                    sliderHandle.style.backgroundColor = "";
                    sliderHandle.innerHTML = '<span class="arrow">\u2192</span>';
                    submitBtn.setAttribute("disabled", "true");

                    btnText.innerText = originalText;
                    submitBtn.style.backgroundColor = "";
                    submitBtn.style.borderColor = "";
                    submitBtn.style.color = "";
                }, 3000);
            } else {
                btnText.innerText = "Error!";
                alert(data.error || "Something went wrong. Please try again.");
                setTimeout(() => { btnText.innerText = originalText; }, 3000);
            }
        } catch (err) {
            btnText.innerText = "Error!";
            alert("Network error. Please try again later.");
            setTimeout(() => { btnText.innerText = originalText; }, 3000);
        }
    });


// --- 8. Security (Anti-Copy/Anti-F12/Anti-Debug) ---
    // DISABLED FOR DEBUGGING
    /*
    // Disable Context Menu
    document.addEventListener('contextmenu', event => event.preventDefault());
    
    // Disable Dragging (Images/Text)
    document.addEventListener('dragstart', event => event.preventDefault());

    // Disable Selection (JS Backup)
    document.addEventListener('selectstart', event => {
        const target = event.target;
        // Allow selection only in inputs/textareas
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
            event.preventDefault();
        }
    });

    // Keydown Restrictions
    document.addEventListener('keydown', function(e) {
        // F12
        if(e.keyCode == 123) {
            e.preventDefault();
            return false;
        }
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
        if(e.ctrlKey && e.shiftKey && (e.keyCode == 73 || e.keyCode == 74 || e.keyCode == 67)) {
            e.preventDefault();
            return false;
        }
        // Ctrl+U (View Source)
        if(e.ctrlKey && e.keyCode == 85) {
            e.preventDefault();
            return false;
        }
        // Ctrl+S (Save Page)
        if(e.ctrlKey && e.keyCode == 83) {
            e.preventDefault();
            return false;
        }
        // Ctrl+P (Print)
        if(e.ctrlKey && e.keyCode == 80) {
            e.preventDefault();
            return false;
        }
    });

    // Advanced Anti-Debugging & Console Clearing
    // Note: This will annoy users who open DevTools by pausing execution
    setInterval(() => {
        // Clear console to hide logs
        console.clear();
        
        // Debugger trap
        const start = new Date().getTime();
        (function(){return false;})['constructor']('debugger')();
        const end = new Date().getTime();
        
        // Detect if debugger paused execution (DevTools open)
        if (end - start > 100) {
            document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:red;font-family:sans-serif;"><h1>Access Denied: Developer Tools Detected</h1></div>';
        }
    }, 1000);
    */

})();
