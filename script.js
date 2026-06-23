/* Boot sequence */

const BOOT_LINES = [
    { text: '> ./whoami',                       cls: 'command', delay: 300  },
    { text: 'loading...',                        cls: '',        delay: 950  },
    { text: 'authenticating principal...',       cls: '',        delay: 1750 },
    { text: 'provisioning execution context...', cls: '',        delay: 2650 },
    { text: 'content fetched. ✅',           cls: 'success', delay: 3500 },
];

const bootScreen  = document.getElementById('boot-screen');
const bootLinesEl = document.getElementById('boot-lines');

BOOT_LINES.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'boot-line' + (cls ? ' ' + cls : '');
        el.textContent = text;
        bootLinesEl.appendChild(el);
    }, delay);
});

setTimeout(() => {
    bootScreen.style.opacity = '0';
    setTimeout(() => bootScreen.remove(), 650);
}, 4300);

/* Scroll fade-in */

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.08 });

document.querySelectorAll('section').forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

/* Nav active state on scroll */

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    document.querySelectorAll(".sidebar-nav a").forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});
