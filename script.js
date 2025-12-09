// script.js - Final Logic
const themeBtn = document.getElementById('theme-btn');
const html = document.documentElement;
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// 1. MOBILE MENU TOGGLE
if(hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}
// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// 2. THEME LOGIC
const saved = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', saved);
if(themeBtn) themeBtn.innerText = saved === 'dark' ? '☀️' : '🌙';

if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        themeBtn.innerText = next === 'dark' ? '☀️' : '🌙';
    });
}

// 3. PAGE TRANSITIONS
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if(href && !href.startsWith('#') && link.target !== '_blank') {
                e.preventDefault();
                document.body.classList.add('page-exit');
                setTimeout(() => window.location.href = href, 500);
            }
        });
    });
});
window.addEventListener('pageshow', (e) => { if(e.persisted) document.body.classList.remove('page-exit'); });

// 4. 3D BACKGROUND
const init3D = () => {
    const canvas = document.querySelector('#bg-canvas');
    if(!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 50;
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    const shapes = [];
    const mat = new THREE.MeshBasicMaterial({color: 0x8a2be2, wireframe:true, transparent:true, opacity:0.15});
    const geoms = [new THREE.IcosahedronGeometry(3), new THREE.OctahedronGeometry(3), new THREE.TorusGeometry(2,0.5,16,100)];
    
    for(let i=0; i<15; i++) {
        const mesh = new THREE.Mesh(geoms[Math.floor(Math.random()*geoms.length)], mat);
        mesh.position.set((Math.random()-0.5)*80, (Math.random()-0.5)*80, (Math.random()-0.5)*80);
        scene.add(mesh); shapes.push(mesh);
    }
    
    const animate = () => {
        requestAnimationFrame(animate);
        shapes.forEach(s => { s.rotation.x += 0.01; s.rotation.y += 0.01; });
        renderer.render(scene, camera);
    };
    animate();
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};
window.onload = init3D;