/* ============================================
   H27 STUDIO — Main JavaScript
   Three.js 3D + GSAP Scroll Animations
   ============================================ */

// ============================================
// 1. CUSTOM CURSOR
// ============================================
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

// Smooth follower
function animateCursor() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Hover effects
const hoverElements = document.querySelectorAll('a, button, .service-card, .work-item');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('hovering');
        cursorFollower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hovering');
        cursorFollower.classList.remove('hovering');
    });
});

// ============================================
// 2. THREE.JS — 3D BACKGROUND SCENE
// ============================================
const canvas = document.getElementById('webgl-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --- Floating Torus Knot (Wireframe) ---
const torusGeometry = new THREE.TorusKnotGeometry(2.2, 0.6, 100, 14, 2, 3);
const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    wireframe: true,
    transparent: true,
    opacity: 0.06
});
const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
torusKnot.position.set(5, 0, -8);
scene.add(torusKnot);

// --- Icosahedron (Wireframe) ---
const icoGeometry = new THREE.IcosahedronGeometry(1.8, 1);
const icoMaterial = new THREE.MeshBasicMaterial({
    color: 0xff00aa,
    wireframe: true,
    transparent: true,
    opacity: 0.05
});
const icosahedron = new THREE.Mesh(icoGeometry, icoMaterial);
icosahedron.position.set(-5, -1.5, -10);
scene.add(icosahedron);

// --- Particle Field ---
const particleCount = 400;
const particleGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 30;

    // Alternate between green and magenta
    if (Math.random() > 0.5) {
        colors[i * 3] = 0;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 0.53;
    } else {
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 0;
        colors[i * 3 + 2] = 0.67;
    }
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.03,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    sizeAttenuation: true
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// --- Orbiting Ring ---
const ringGeometry = new THREE.TorusGeometry(3.5, 0.015, 8, 80);
const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff88,
    transparent: true,
    opacity: 0.08
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.position.set(0, 0, -12);
ring.rotation.x = Math.PI * 0.4;
scene.add(ring);

// Second ring
const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(2.8, 0.015, 8, 80),
    new THREE.MeshBasicMaterial({ color: 0xff00aa, transparent: true, opacity: 0.06 })
);
ring2.position.set(0, 0, -12);
ring2.rotation.x = Math.PI * 0.6;
ring2.rotation.y = Math.PI * 0.3;
scene.add(ring2);

camera.position.z = 8;

// Scroll position tracking for 3D
let scrollProgress = 0;

// ---- Animation Loop ----
function animate() {
    requestAnimationFrame(animate);

    const time = Date.now() * 0.001;

    // Rotate shapes
    torusKnot.rotation.x = time * 0.15 + scrollProgress * 2;
    torusKnot.rotation.y = time * 0.1;

    icosahedron.rotation.x = time * 0.12;
    icosahedron.rotation.y = time * 0.18 + scrollProgress * 1.5;

    ring.rotation.z = time * 0.05;
    ring2.rotation.z = -time * 0.07;

    // Float particles slowly
    particles.rotation.y = time * 0.02;
    particles.rotation.x = time * 0.01;

    // Move camera slightly based on scroll
    camera.position.y = -scrollProgress * 3;
    camera.position.z = 8 + scrollProgress * 2;

    // Subtle mouse parallax on camera
    camera.rotation.x = (mouseY / window.innerHeight - 0.5) * 0.05;
    camera.rotation.y = (mouseX / window.innerWidth - 0.5) * 0.05;

    renderer.render(scene, camera);
}
animate();

// ============================================
// 3. GSAP + SCROLLTRIGGER SETUP
// ============================================
gsap.registerPlugin(ScrollTrigger);

// --- Hero Animations ---
const heroTimeline = gsap.timeline({ delay: 0.3 });

heroTimeline
    .to('.hero-badge', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    })
    .to('.title-word', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.1
    }, '-=0.4')
    .to('.hero-sub', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3')
    .to('.hero-cta-row', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
    }, '-=0.3')
    .to('.hero-scroll-indicator', {
        opacity: 0.6,
        duration: 1,
        ease: 'power2.out'
    }, '-=0.2');

// --- Scroll Progress Bar ---
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    scrollProgress = winScroll / height;
    document.getElementById('scrollProgress').style.width = (scrollProgress * 100) + '%';
});

// --- Nav Scroll State ---
ScrollTrigger.create({
    start: 'top -80',
    onUpdate: (self) => {
        document.getElementById('nav').classList.toggle('scrolled', self.progress > 0);
    }
});

// --- Service Cards Stagger ---
gsap.utils.toArray('.service-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 60,
        scale: 0.97,
        duration: 0.8,
        delay: i * 0.1,
        ease: 'power3.out'
    });
});

// --- Work Items ---
gsap.utils.toArray('.work-item').forEach((item, i) => {
    gsap.from(item, {
        scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            end: 'top 50%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 80,
        scale: 0.95,
        rotation: i % 2 === 0 ? -2 : 2,
        duration: 1,
        ease: 'power3.out'
    });
});

// --- Section Headers ---
gsap.utils.toArray('.section-header, .about-left').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// --- About Section ---
gsap.from('.about-right', {
    scrollTrigger: {
        trigger: '.about-right',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    x: 60,
    duration: 1,
    ease: 'power3.out'
});

// --- Stats Counter Animation ---
gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.target);
    gsap.fromTo(stat, {
        innerText: 0
    }, {
        innerText: target,
        duration: 2,
        ease: 'power2.out',
        snap: { innerText: 1 },
        scrollTrigger: {
            trigger: stat,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        onUpdate: function () {
            stat.textContent = Math.round(this.targets()[0].innerText);
        }
    });
});

// --- Process Steps ---
gsap.utils.toArray('.process-step').forEach((step, i) => {
    gsap.from(step, {
        scrollTrigger: {
            trigger: step,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        duration: 0.7,
        delay: i * 0.15,
        ease: 'power3.out'
    });
});

// --- Contact Section ---
gsap.from('.contact-inner', {
    scrollTrigger: {
        trigger: '.contact-inner',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 60,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out'
});

// --- Parallax on 3D elements based on scroll ---
ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: (self) => {
        scrollProgress = self.progress;
        // Adjust 3D element opacity based on scroll
        const heroOpacity = Math.max(0, 1 - scrollProgress * 4);
        torusKnot.material.opacity = 0.06 * (0.3 + heroOpacity * 0.7);
        icosahedron.material.opacity = 0.05 * (0.3 + heroOpacity * 0.7);
    }
});

// ============================================
// 4. HERO PARTICLES (CSS-based)
// ============================================
const particlesContainer = document.getElementById('heroParticles');
for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (5 + Math.random() * 10) + 's';
    p.style.animationDelay = Math.random() * 10 + 's';
    p.style.width = (1 + Math.random() * 3) + 'px';
    p.style.height = p.style.width;
    particlesContainer.appendChild(p);
}

// ============================================
// 5. MOBILE MENU
// ============================================
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        menuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ============================================
// 6. SMOOTH SCROLL FOR NAV LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============================================
// 7. WINDOW RESIZE
// ============================================
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============================================
// 8. BRANDS SECTION ANIMATIONS
// ============================================
gsap.from('.brands-heading', {
    scrollTrigger: {
        trigger: '.brands-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    y: 40,
    duration: 0.8,
    ease: 'power3.out'
});

gsap.from('.brands-badge', {
    scrollTrigger: {
        trigger: '.brands-section',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
    },
    opacity: 0,
    scale: 0.5,
    duration: 0.6,
    delay: 0.3,
    ease: 'back.out(2)'
});

gsap.utils.toArray('.brand-pill').forEach((pill, i) => {
    gsap.from(pill, {
        scrollTrigger: {
            trigger: '.brands-pills',
            start: 'top 85%',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 50,
        scale: 0.7,
        rotation: (i % 2 === 0 ? -15 : 15),
        duration: 0.7,
        delay: i * 0.08,
        ease: 'back.out(1.5)'
    });
});

// ============================================
// 9. MAGNETIC BUTTON EFFECT (CTA)
// ============================================
const magneticBtns = document.querySelectorAll('.btn-primary, .cta-link');
magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

// ============================================
// 10. PAGE LOAD TRANSITION
// ============================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    gsap.to(document.body, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out'
    });
});
