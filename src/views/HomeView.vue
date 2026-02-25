<script setup lang="ts">
</script>

<template>
  <div class="page-root">

    <!-- Fondo: SVG estático, sin blur, sin filter, cero coste GPU -->
    <div class="bg-canvas" aria-hidden="true">
      <svg class="bg-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="g1" cx="20%" cy="20%" r="60%">
            <stop offset="0%" stop-color="#ff2d7a" stop-opacity="0.18" />
            <stop offset="100%" stop-color="#ff2d7a" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="g2" cx="85%" cy="80%" r="55%">
            <stop offset="0%" stop-color="#ff6fa8" stop-opacity="0.14" />
            <stop offset="100%" stop-color="#ff6fa8" stop-opacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="#0f0a10" />
        <rect width="1440" height="900" fill="url(#g1)" />
        <rect width="1440" height="900" fill="url(#g2)" />
        <circle cx="120" cy="120" r="280" fill="none" stroke="#ff2d7a" stroke-width="1" stroke-opacity="0.08" />
        <circle cx="120" cy="120" r="420" fill="none" stroke="#ff2d7a" stroke-width="1" stroke-opacity="0.05" />
        <circle cx="1320" cy="780" r="300" fill="none" stroke="#ff6fa8" stroke-width="1" stroke-opacity="0.07" />
        <line x1="0" y1="450" x2="1440" y2="420" stroke="#ff2d7a" stroke-width="0.5" stroke-opacity="0.06" />
      </svg>
    </div>

    <div class="page-content">
      <div class="container">

        <!-- HERO -->
        <section class="hero fade-in-up">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            <span>Analíticas de Instagram</span>
          </div>
          <div class="ghost-wrap">
            <span class="ghost">👻</span>
          </div>
          <h1>Ghost<span class="accent">Follow</span></h1>
          <p class="tagline">Toma el control absoluto<br>de tu Instagram.</p>
          <p class="sub-tagline">
            Descubre quién te dejó de seguir, quiénes son tus verdaderos fans
            y analiza tu crecimiento con exactitud milimétrica.
          </p>
          <div class="hero-actions">
            <router-link to="/login" class="btn btn-primary">
              <span>Entrar al Panel</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </router-link>
            <router-link to="/register" class="btn btn-ghost">Crear Cuenta Gratis</router-link>
          </div>
          <div class="hero-stat-row">
            <div class="stat"><strong>100%</strong><span>seguro</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><strong>sin</strong><span>contraseña IG</span></div>
            <div class="stat-divider"></div>
            <div class="stat"><strong>&lt;1 min</strong><span>para empezar</span></div>
          </div>
        </section>

        <!-- FEATURES -->
        <section class="features fade-in-up" style="--delay: 0.15s">
          <div class="feature-card">
            <div class="feature-icon">💔</div>
            <h3>Fans & Traidores</h3>
            <p>Cruza datos al instante. Detecta quién no te devuelve el follow y quién te sigue fielmente.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3>Historial Evolutivo</h3>
            <p>Guarda tus reportes en la nube. Compara tu crecimiento real mes a mes sin perder datos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔔</div>
            <h3>Alertas por Email</h3>
            <p>Recibe notificaciones automáticas y resúmenes directos a tu correo al instante.</p>
          </div>
        </section>

        <!-- HOW IT WORKS -->
        <section class="how-it-works fade-in-up" style="--delay: 0.3s">
          <div class="section-label">Cómo funciona</div>
          <h2>Empieza en menos de 1 minuto</h2>

          <div class="hiw-grid">
            <div class="steps">
              <div class="step">
                <div class="step-num">01</div>
                <div class="step-body">
                  <h4>Regístrate sin tarjeta</h4>
                  <p>Solo necesitas tu email y tu usuario de IG. Es 100% seguro.</p>
                </div>
              </div>
              <div class="step-connector"></div>
              <div class="step">
                <div class="step-num">02</div>
                <div class="step-body">
                  <h4>Sube tu archivo .zip</h4>
                  <p>Descarga tus datos oficiales de Instagram y súbelos. <strong>Nosotros no pedimos tu
                      contraseña.</strong></p>
                </div>
              </div>
              <div class="step-connector"></div>
              <div class="step">
                <div class="step-num">03</div>
                <div class="step-body">
                  <h4>Desbloquea el panel</h4>
                  <p>Accede a métricas que la app oficial te oculta. ¡Encuentra a los fantasmas!</p>
                </div>
              </div>
            </div>

            <div class="terminal">
              <div class="terminal-bar">
                <span class="tb-dot tb-red"></span>
                <span class="tb-dot tb-yellow"></span>
                <span class="tb-dot tb-green"></span>
                <span class="terminal-title">ghostfollow — análisis</span>
              </div>
              <div class="terminal-body">
                <p class="t-line"><span class="t-prompt">$</span> analizando <span
                    class="t-file">followers.zip</span>...</p>
                <p class="t-line t-dim">▸ Procesando seguidores...</p>
                <p class="t-line t-dim">▸ Procesando seguidos...</p>
                <p class="t-line t-success">✓ 1,204 seguidores encontrados.</p>
                <p class="t-line t-success">✓ 987 seguidos procesados.</p>
                <p class="t-line t-alert">⚠ ¡Alerta! 3 usuarios te dejaron de seguir.</p>
                <p class="t-line t-dim">▸ Generando reporte...</p>
                <p class="t-line t-success">✓ Dashboard listo. <span class="t-cursor">█</span></p>
              </div>
            </div>
          </div>
        </section>

        <!-- FOOTER -->
        <footer class="footer fade-in-up" style="--delay: 0.4s">
          <p>© {{ new Date().getFullYear() }} GhostFollow &mdash; Analíticas seguras y privadas.</p>
        </footer>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-root {
  min-height: 100vh;
  width: 100%;
  font-family: 'DM Sans', sans-serif;
  color: #f0e6ec;
  background: #0f0a10;
  position: relative;
}

/* ── FONDO SVG ESTÁTICO ── sin blur, sin filter, sin animación de filtros */
.bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.bg-svg {
  width: 100%;
  height: 100%;
  display: block;
}

.page-content {
  position: relative;
  z-index: 1;
  padding: 2rem 1rem 4rem;
}

.container {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

/* ── ENTRADA: opacity + transform → compositor-only, cero repaint */
.fade-in-up {
  animation: fadeInUp 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(26px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── HERO ── */
.hero {
  text-align: center;
  padding: 5rem 2rem 3.5rem;
  border-radius: 28px;
  background: #1a1020;
  border: 1px solid rgba(255, 45, 122, 0.18);
  box-shadow: 0 0 80px -20px rgba(255, 45, 122, 0.2),
    0 2px 0 0 rgba(255, 45, 122, 0.18);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff2d7a, transparent);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 45, 122, 0.12);
  border: 1px solid rgba(255, 45, 122, 0.22);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #ff6fa8;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.badge-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #ff2d7a;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.ghost-wrap {
  margin-bottom: 0.75rem;
}

.ghost {
  font-size: 4.5rem;
  display: inline-block;
  will-change: transform;
  animation: float 3.5s ease-in-out infinite;
  filter: drop-shadow(0 8px 20px rgba(255, 45, 122, 0.35));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-14px);
  }
}

h1 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  color: #f0e6ec;
  letter-spacing: -2px;
  line-height: 1;
  margin-bottom: 1.25rem;
}

.accent {
  color: #ff2d7a;
}

.tagline {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.45rem);
  font-weight: 700;
  color: #ff6fa8;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.sub-tagline {
  font-size: 1rem;
  color: #8c7a88;
  max-width: 500px;
  margin: 0 auto 2.5rem;
  line-height: 1.65;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0.85rem 1.75rem;
  border-radius: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  background: #ff2d7a;
  color: #fff;
  box-shadow: 0 4px 20px rgba(255, 45, 122, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(255, 45, 122, 0.5);
}

.btn-ghost {
  background: transparent;
  color: #ff6fa8;
  border: 1px solid rgba(255, 45, 122, 0.22);
}

.btn-ghost:hover {
  transform: translateY(-2px);
  background: rgba(255, 45, 122, 0.1);
  border-color: #ff2d7a;
}

.hero-stat-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.stat strong {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  color: #f0e6ec;
  font-weight: 800;
}

.stat span {
  font-size: 0.7rem;
  color: #8c7a88;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.stat-divider {
  width: 1px;
  height: 30px;
  background: rgba(255, 45, 122, 0.18);
}

/* ── FEATURES ── */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.feature-card {
  background: #1a1020;
  border: 1px solid rgba(255, 45, 122, 0.15);
  border-radius: 22px;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff6fa8, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 45, 122, 0.4);
  box-shadow: 0 12px 40px -8px rgba(255, 45, 122, 0.2);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 2.2rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(-5deg);
}

.feature-card h3 {
  font-family: 'Syne', sans-serif;
  color: #f0e6ec;
  font-size: 1.02rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: #8c7a88;
  font-size: 0.87rem;
  line-height: 1.55;
}

/* ── HOW IT WORKS ── */
.how-it-works {
  background: #1a1020;
  border: 1px solid rgba(255, 45, 122, 0.18);
  border-radius: 28px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
}

.how-it-works::before {
  content: '';
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #ff2d7a, transparent);
}

.section-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #ff2d7a;
  margin-bottom: 0.6rem;
}

.how-it-works h2 {
  font-family: 'Syne', sans-serif;
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  font-weight: 800;
  color: #f0e6ec;
  letter-spacing: -0.5px;
  margin-bottom: 2.5rem;
}

.hiw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: start;
}

.steps {
  display: flex;
  flex-direction: column;
}

.step {
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
}

.step-connector {
  width: 1px;
  height: 1.5rem;
  background: rgba(255, 45, 122, 0.18);
  margin-left: 19px;
}

.step-num {
  font-family: 'Syne', sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  color: #ff2d7a;
  background: rgba(255, 45, 122, 0.1);
  border: 1px solid rgba(255, 45, 122, 0.22);
  border-radius: 8px;
  min-width: 38px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  flex-shrink: 0;
}

.step-body h4 {
  font-family: 'Syne', sans-serif;
  font-size: 0.93rem;
  font-weight: 700;
  color: #f0e6ec;
  margin-bottom: 0.25rem;
}

.step-body p {
  font-size: 0.84rem;
  color: #8c7a88;
  line-height: 1.5;
}

.step-body strong {
  color: #f0e6ec;
}

/* ── TERMINAL ── */
.terminal {
  background: #080510;
  border: 1px solid rgba(255, 45, 122, 0.2);
  border-radius: 16px;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  font-size: 0.81rem;
}

.terminal-bar {
  background: #120a18;
  border-bottom: 1px solid rgba(255, 45, 122, 0.12);
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 6px;
}

.tb-dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}

.tb-red {
  background: #ff5f57;
}

.tb-yellow {
  background: #febc2e;
}

.tb-green {
  background: #28c840;
}

.terminal-title {
  flex: 1;
  text-align: center;
  font-size: 0.7rem;
  color: #5a4860;
  font-family: 'DM Sans', sans-serif;
}

.terminal-body {
  padding: 1.25rem 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.t-line {
  color: #c8b8c4;
  line-height: 1.5;
}

.t-dim {
  color: #4a3850;
}

.t-prompt {
  color: #ff2d7a;
  font-weight: bold;
  margin-right: 8px;
}

.t-file {
  color: #ff6fa8;
}

.t-success {
  color: #3dca8a;
}

.t-alert {
  color: #ff6fa8;
  font-weight: bold;
}

.t-cursor {
  color: #ff2d7a;
  animation: blink 1s step-end infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

/* ── FOOTER ── */
.footer {
  text-align: center;
  color: #5a4860;
  font-size: 0.85rem;
  padding-top: 0.5rem;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .hero {
    padding: 3.5rem 1.5rem 3rem;
  }

  h1 {
    letter-spacing: -1px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .features {
    grid-template-columns: 1fr;
  }

  .how-it-works {
    padding: 2rem 1.5rem;
  }

  .hiw-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .terminal {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {

  .ghost,
  .badge-dot,
  .fade-in-up,
  .t-cursor {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
