class HomeView {
    constructor() {
        this._content = document.getElementById('content');
    }

    show() {
        this._content.innerHTML = `
            <section class="home-hero">
                <div class="hero-text">
                    <h1>CodingCamp Story App</h1>
                    <p class="subheadline">Bagikan kisah dan momen terbaikmu dengan dunia. Temukan inspirasi dari cerita orang lain di seluruh penjuru dunia!</p>
                    <div class="cta">
                        <a href="#/stories" class="button primary">Lihat Cerita</a>
                        <a href="#/add" class="button secondary">Tambah Cerita</a>
                    </div>
                </div>
            </section>
            <section class="home-features">
                <h2>Fitur Unggulan</h2>
                <div class="features-grid">
                    <div class="feature-card">
                        <span class="feature-icon">📝</span>
                        <h3>Buat Cerita</h3>
                        <p>Bagikan pengalamanmu dengan foto, lokasi, dan caption menarik.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🌍</span>
                        <h3>Jelajahi Dunia</h3>
                        <p>Lihat cerita dari berbagai tempat dan temukan inspirasi baru.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🗺️</span>
                        <h3>Peta Interaktif</h3>
                        <p>Temukan lokasi cerita secara visual di peta interaktif.</p>
                    </div>
                    <div class="feature-card">
                        <span class="feature-icon">🔒</span>
                        <h3>Aman & Pribadi</h3>
                        <p>Data dan cerita Anda terjaga keamanannya dengan baik.</p>
                    </div>
                </div>
            </section>
        `;
    }
}

export default HomeView; 