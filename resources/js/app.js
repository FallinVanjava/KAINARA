import './bootstrap';
import Alpine from 'alpinejs';

window.Alpine = Alpine;

const FAVORITES_KEY = 'kainara:favorites';

Alpine.store('favorites', {
    items: JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]'),
    open: false,

    persist() {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(this.items));
    },

    has(type, id) {
        return this.items.some((item) => item.type === type && item.id === id);
    },

    toggle(item) {
        this.items = this.has(item.type, item.id)
            ? this.items.filter((i) => !(i.type === item.type && i.id === item.id))
            : [...this.items, item];
        this.persist();
    },

    remove(key) {
        this.items = this.items.filter((item) => item.key !== key);
        this.persist();
    },
});

Alpine.data('scanModule', (motifUrl, skintoneUrl) => ({
    tab: 'motif',
    file: null,
    fileName: '',
    dragging: false,
    loading: false,
    error: null,
    result: null,

    pick(event) {
        const [file] = event.target.files || [];
        this.setFile(file);
    },

    drop(event) {
        this.dragging = false;
        this.setFile(event.dataTransfer.files[0]);
    },

    setFile(file) {
        if (!file) return;
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            this.error = 'Format harus JPG, PNG, atau WEBP.';
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            this.error = 'Ukuran gambar maksimal 2 MB.';
            return;
        }
        this.file = file;
        this.fileName = file.name;
        this.error = null;
        this.result = null;
    },

    reset() {
        this.file = null;
        this.fileName = '';
        this.error = null;
        this.result = null;
        if (this.$refs.input) this.$refs.input.value = '';
    },

    async submit() {
        if (!this.file) {
            this.error = 'Pilih gambar terlebih dahulu.';
            return;
        }

        this.loading = true;
        this.error = null;
        this.result = null;

        const body = new FormData();
        body.append('image', this.file);

        try {
            const response = await fetch(this.tab === 'motif' ? motifUrl : skintoneUrl, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body,
            });
            const payload = await response.json();

            if (!response.ok || !payload.ok) {
                this.error = payload.message || 'Gambar belum bisa dianalisis. Coba lagi.';
                return;
            }
            this.result = payload;
        } catch {
            this.error = 'Koneksi ke layanan AI gagal. Periksa jaringan lalu coba lagi.';
        } finally {
            this.loading = false;
        }
    },
}));

Alpine.start();

// Native scroll motion effects (Ponytail: 0 dependencies, failsafe)
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('[data-reveal]').forEach((el, index) => {
            const rect = el.getBoundingClientRect();
            if (rect.top >= window.innerHeight) {
                el.classList.add('reveal-init');
                const delay = el.dataset.delay || ((index % 3) * 80);
                if (delay) el.style.transitionDelay = `${delay}ms`;
                observer.observe(el);
            }
        });
    }

    const progressEl = document.getElementById('scroll-progress');
    if (progressEl) {
        let ticking = false;
        window.addEventListener(
            'scroll',
            () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                        const pct = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
                        progressEl.style.width = `${pct}%`;

                        // Parallax: elements with data-parallax move slower than scroll
                        const y = window.scrollY;
                        document.querySelectorAll('[data-parallax]').forEach((el) => {
                            const rate = parseFloat(el.dataset.parallax) || 0.1;
                            el.style.transform = `translate3d(0, ${y * rate}px, 0)`;
                        });

                        ticking = false;
                    });
                    ticking = true;
                }
            },
            { passive: true }
        );
    }
}
