/**
 * Script for Ramzi Dhaoui Portfolio
 * Handles Navbar scroll effects and scroll animations
 */

document.addEventListener('DOMContentLoaded', () => {

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (Basic setup)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    const links = document.querySelectorAll('.nav-links li a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Scroll Reveal Animation Initialization
    // We will use IntersectionObserver to animate elements as they enter the viewport
    const revealElements = document.querySelectorAll('.reveal');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Volume Toggle for vibe-section videos ---
    document.querySelectorAll('.vol-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.vibe-card');
            const video = card.querySelector('.vibe-video');
            const icon = btn.querySelector('i');
            if (video) {
                video.muted = !video.muted;
                if (video.muted) {
                    icon.className = 'fas fa-volume-mute';
                    btn.classList.remove('active');
                } else {
                    icon.className = 'fas fa-volume-up';
                    btn.classList.add('active');
                }
            }
        });
    });

    // --- TikTok Auto-Sync Feed (Supabase) ---
    const SUPABASE_URL = 'https://omipqlbwvksokgzhfjqy.supabase.co';
    const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9taXBxbGJ3dmtzb2tnemhmanF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzMxMzIsImV4cCI6MjA4NzgwOTEzMn0.L2doc-nlXlsUj1K2ED8UlS0eitH_X9JWjkk6Br7Dv48';

    async function loadTikTokFeed() {
        const feed = document.getElementById('tiktok-feed');
        if (!feed) return;

        try {
            const res = await fetch(
                `${SUPABASE_URL}/rest/v1/tiktok_videos?select=video_id,embed_url,video_url,description&order=fetched_at.desc&limit=3`,
                { headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
            );

            if (!res.ok) throw new Error('Supabase fetch failed');
            const videos = await res.json();

            // Clear the spinner
            feed.innerHTML = '';

            if (!videos || videos.length === 0) throw new Error('No videos returned');

            const delays = ['', 'fade-in-up delay-1', 'fade-in-up delay-2'];
            videos.forEach((v, i) => {
                const card = document.createElement('div');
                card.className = `vibe-card tiktok-card reveal ${delays[i] || ''}`;
                card.innerHTML = `
                    <iframe class="tiktok-iframe"
                        src="${v.embed_url}"
                        title="Ramzi Dhaoui TikTok vlog"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope"
                        allowfullscreen></iframe>
                    <a href="${v.video_url}" target="_blank" rel="noopener noreferrer" class="tiktok-link-overlay">
                        <i class="fab fa-tiktok"></i>
                        <span>Watch on TikTok</span>
                    </a>`;
                feed.appendChild(card);

                // Register with the reveal observer
                revealObserver.observe(card);
            });

        } catch (err) {
            console.warn('TikTok feed load failed, using fallback:', err);
            feed.innerHTML = `
                <div class="tiktok-loading" style="grid-column: 1/-1;">
                    <i class="fab fa-tiktok" style="font-size:2.5rem;color:var(--secondary-gold)"></i>
                    <p>Check out my latest videos on TikTok!</p>
                    <a href="https://www.tiktok.com/@ramzi.dh" target="_blank" rel="noopener noreferrer" class="btn-primary">
                        <i class="fab fa-tiktok"></i> @ramzi.dh
                    </a>
                </div>`;
        }
    }

    loadTikTokFeed();
});
