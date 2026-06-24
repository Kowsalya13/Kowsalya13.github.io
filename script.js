/* ── Typewriter utility ── */

function typewriter(el, text, speed, onComplete) {
    el.textContent = '';
    let i = 0;
    const cur = document.createElement('span');
    cur.className = 'cursor';
    cur.textContent = '_';
    el.appendChild(cur);

    const iv = setInterval(() => {
        el.insertBefore(document.createTextNode(text[i]), cur);
        i++;
        if (i >= text.length) {
            clearInterval(iv);
            setTimeout(() => {
                cur.remove();
                if (onComplete) onComplete();
            }, 350);
        }
    }, speed);
}

/* ── Boot sequence ── */

const BOOT_LINES = [
    { text: '> ./whoami',                        cls: 'command', delay: 300  },
    { text: 'loading...',                         cls: '',        delay: 950  },
    { text: 'authenticating principal...',        cls: '',        delay: 1750 },
    { text: 'provisioning execution context...', cls: '',        delay: 2650 },
    { text: 'content fetched. ✅',               cls: 'success', delay: 3500 },
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

let resolveBootDone;
const bootDone = new Promise(resolve => { resolveBootDone = resolve; });

setTimeout(() => {
    bootScreen.style.opacity = '0';
    setTimeout(() => {
        bootScreen.remove();
        resolveBootDone();
    }, 650);
}, 4300);

/* ── h2 role title typewriter (after boot) ── */

const h2 = document.querySelector('#home h2');
const roleText = h2.textContent.trim();
h2.innerHTML = '<span class="cursor">_</span>';

setTimeout(() => {
    const typeCursor = h2.querySelector('.cursor');
    let i = 0;
    const iv = setInterval(() => {
        h2.insertBefore(document.createTextNode(roleText[i]), typeCursor);
        i++;
        if (i >= roleText.length) {
            clearInterval(iv);
            setTimeout(() => typeCursor.remove(), 1500);
        }
    }, 75);
}, 4950);

/* ── Sidebar whoami.txt card ── */

const sidebarCard  = document.querySelector('.sidebar-card');
const sidebarTitle = sidebarCard.querySelector('.card-title');
const sidebarTitleText = sidebarTitle.textContent.trim();
const sidebarPs = sidebarCard.querySelectorAll('p');

sidebarTitle.textContent = '';
sidebarPs.forEach(p => {
    p.style.opacity   = '0';
    p.style.transition = 'opacity 0.4s ease';
});

setTimeout(() => {
    typewriter(sidebarTitle, sidebarTitleText, 55, () => {
        sidebarPs.forEach((p, i) => {
            setTimeout(() => { p.style.opacity = '1'; }, i * 110);
        });
    });
}, 5100);

/* ── Dashboard card titles ── */

document.querySelectorAll('.dashboard-card').forEach((card, idx) => {
    const title    = card.querySelector('.card-title');
    const titleText = title.textContent.trim();
    const body     = card.querySelector('pre');

    title.textContent = '';
    if (body) {
        body.style.opacity    = '0';
        body.style.transition = 'opacity 0.5s ease';
    }

    setTimeout(() => {
        typewriter(title, titleText, 55, () => {
            if (body) body.style.opacity = '1';
        });
    }, 5200 + idx * 450);
});

/* ── Section headings typewriter + content reveal ── */

document.querySelectorAll('section').forEach(section => {
    const h3 = section.querySelector('h3');
    if (!h3) return;

    const headingText = h3.textContent.trim();
    h3.textContent = '';
    section.classList.add('fade-in');

    // Hide body content until heading finishes typing
    Array.from(section.children).forEach(child => {
        if (child !== h3) {
            child.style.opacity    = '0';
            child.style.transform  = 'translateY(14px)';
            child.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        }
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                section.classList.add('visible');

                // Wait for boot to finish before typing — fixes sections already in viewport on load
                bootDone.then(() => {
                    typewriter(h3, headingText, 55, () => {
                        Array.from(section.children).forEach(child => {
                            if (child !== h3) {
                                child.style.opacity   = '1';
                                child.style.transform = 'translateY(0)';

                                setTimeout(() => {
                                    child.style.opacity    = '';
                                    child.style.transform  = '';
                                    child.style.transition = '';
                                }, 600);
                            }
                        });

                        if (section.id === 'skills') {
                            section.querySelectorAll('.skill-card').forEach((card, i) => {
                                setTimeout(() => card.classList.add('card-visible'), i * 80);
                            });
                        }
                    });
                });

                obs.unobserve(section);
            }
        });
    }, { threshold: 0.1 });

    obs.observe(section);
});

/* ── Nav active state on scroll ── */

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});
