<script setup lang="ts">
</script>

<template>
  <div class="page-root">

    <!-- Fondo estático: SVG con manchas suaves sin blur ni filter -->
    <div class="bg-canvas" aria-hidden="true">
      <svg class="bg-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="blob1" cx="15%" cy="15%" r="55%">
            <stop offset="0%" stop-color="#f9a8d4" stop-opacity="0.85" />
            <stop offset="100%" stop-color="#fce4ec" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="blob2" cx="88%" cy="88%" r="55%">
            <stop offset="0%" stop-color="#fdf2f8" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#fce4ec" stop-opacity="0" />
          </radialGradient>
          <radialGradient id="blob3" cx="60%" cy="30%" r="35%">
            <stop offset="0%" stop-color="#fbcfe8" stop-opacity="0.5" />
            <stop offset="100%" stop-color="#fce4ec" stop-opacity="0" />
          </radialGradient>
        </defs>
        <!-- Base -->
        <rect width="1440" height="900" fill="#fce4ec" />
        <!-- Manchas de color, sin filtros -->
        <rect width="1440" height="900" fill="url(#blob1)" />
        <rect width="1440" height="900" fill="url(#blob2)" />
        <rect width="1440" height="900" fill="url(#blob3)" />
      </svg>
    </div>

    <div class="page-content">
      <div class="container">

        <!-- HERO -->
        <section class="card hero fade-in-up">
          <div class="ghost-wrap">
            <span class="ghost">👻</span>
          </div>
          <h1>GhostFollow</h1>
          <p class="tagline">Toma el control absoluto de tu Instagram.</p>
          <p class="sub-tagline">
            Descubre quién te dejó de seguir, quiénes son tus verdaderos fans
            y analiza tu crecimiento con exactitud milimétrica.
          </p>
          <div class="hero-actions">
            <router-link to="/login" class="btn btn-primary">Entrar al Panel</router-link>
            <router-link to="/register" class="btn btn-outline">Crear Cuenta Gratis</router-link>
          </div>
        </section>

        <!-- FEATURES -->
        <section class="features fade-in-up" style="--delay: 0.2s">
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
        <section class="card how-it-works fade-in-up" style="--delay: 0.3s">
          <h2>Empieza en menos de 1 minuto</h2>
          <div class="hiw-grid">
            <div class="steps">
              <div class="step">
                <span class="step-num">1</span>
                <div class="step-body">
                  <h4>Regístrate sin tarjeta</h4>
                  <p>Solo necesitas tu email y tu usuario de IG. Es 100% seguro.</p>
                </div>
              </div>
              <div class="step">
                <span class="step-num">2</span>
                <div class="step-body">
                  <h4>Sube tu archivo .zip</h4>
                  <p>Descarga tus datos oficiales de Instagram y súbelos. <strong>Nosotros no pedimos tu contraseña de
                      IG.</strong></p>
                </div>
              </div>
              <div class="step">
                <span class="step-num">3</span>
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
              </div>
              <div class="terminal-body">
                <p class="t-line"><span class="t-prompt">></span> Analizando followers.zip...</p>
                <p class="t-line t-success"><span class="t-prompt">></span> 1,204 seguidores encontrados.</p>
                <p class="t-line t-alert"><span class="t-prompt">></span> ¡Alerta! 3 usuarios te dejaron de seguir.</p>
                <p class="t-line"><span class="t-prompt">></span> Generando reporte en el Dashboard...</p>
                <p class="t-line t-success"><span class="t-prompt">></span> Listo.<span class="t-cursor"> █</span></p>
              </div>
            </div>
          </div>
        </section>

        <footer class="footer fade-in-up" style="--delay: 0.4s">
          <p>© {{ new Date().getFullYear() }} GhostFollow. Analíticas seguras y privadas.</p>
        </footer>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-root {
  width: 100%;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* ── FONDO: SVG fijo, sin blur, sin filter ── */
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

/* ── LAYOUT ── */
.page-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* ── ANIMACIONES: solo opacity + transform = cero repaint ── */
.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: var(--delay, 0s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ── CARD: sin backdrop-filter — mismo look con fondo opaco + sombra ──
   El truco: fondo blanco con alta opacidad (0.88) sobre el SVG de colores
   da visualmente el mismo resultado que glassmorphism, sin ningún coste.  */
.card {
  background: rgba(255, 255, 255, 0.88);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow:
    0 20px 40px -10px rgba(233, 30, 99, 0.12),
    0 2px 8px -2px rgba(233, 30, 99, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}

/* ── HERO ── */
.hero {
  padding: 4rem 2rem;
  text-align: center;
}

.ghost-wrap {
  margin-bottom: 0.5rem;
}

.ghost {
  font-size: 5rem;
  display: inline-block;
  will-change: transform;
  /* eleva solo el fantasma a compositing layer */
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 10px rgba(233, 30, 99, 0.2));
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-15px);
  }
}

h1 {
  font-size: 3.5rem;
  font-weight: 800;
  color: #831843;
  letter-spacing: -1.5px;
  margin-bottom: 0.5rem;
}

.tagline {
  font-size: 1.4rem;
  color: #be185d;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
}

.sub-tagline {
  font-size: 1.05rem;
  color: #64748b;
  max-width: 560px;
  margin: 0 auto 2.5rem;
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 16px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  /* solo transform en hover → compositor, sin repaint */
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: #fff;
  box-shadow: 0 4px 14px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(233, 30, 99, 0.4);
}

.btn-outline {
  background: rgba(255, 255, 255, 0.6);
  color: #db2777;
  border: 2px solid #f472b6;
}

.btn-outline:hover {
  transform: translateY(-2px);
  background: #fce7f3;
  border-color: #db2777;
}

/* ── FEATURES ── */
.features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  /* sin backdrop-filter: mismo truco de fondo semiopaco */
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.95);
  border-radius: 24px;
  padding: 2rem 1.5rem;
  text-align: center;
  box-shadow: 0 4px 16px -4px rgba(233, 30, 99, 0.08);
  /* hover: solo transform → GPU, sin repaint */
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px -6px rgba(233, 30, 99, 0.18);
  border-color: #fda4af;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.feature-card:hover .feature-icon {
  transform: scale(1.15) rotate(-5deg);
}

.feature-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #831843;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.55;
}

/* ── HOW IT WORKS ── */
.how-it-works {
  padding: 3rem;
}

.how-it-works h2 {
  font-size: 2rem;
  font-weight: 800;
  color: #831843;
  letter-spacing: -0.5px;
  margin-bottom: 2rem;
  text-align: center;
}

.hiw-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step {
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
}

.step-num {
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: #fff;
  width: 35px;
  height: 35px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.05rem;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
}

.step-body h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #831843;
  margin-bottom: 0.2rem;
}

.step-body p {
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.45;
}

.step-body strong {
  color: #be185d;
}

/* ── TERMINAL ── */
.terminal {
  background: #1e293b;
  border-radius: 16px;
  overflow: hidden;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  box-shadow: 0 20px 30px -8px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  border: 1px solid #0f172a;
}

.terminal-bar {
  background: #0f172a;
  padding: 0.65rem 1rem;
  display: flex;
  gap: 6px;
  align-items: center;
}

.tb-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.tb-red {
  background: #ef4444;
}

.tb-yellow {
  background: #eab308;
}

.tb-green {
  background: #22c55e;
}

.terminal-body {
  padding: 1.25rem 1.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #e2e8f0;
}

.t-line {
  line-height: 1.5;
}

.t-prompt {
  color: #db2777;
  font-weight: bold;
  margin-right: 8px;
}

.t-success {
  color: #10b981;
}

.t-alert {
  color: #f43f5e;
  font-weight: bold;
}

.t-cursor {
  color: #db2777;
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
  color: #9d174d;
  opacity: 0.75;
  font-size: 0.88rem;
  font-weight: 500;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  h1 {
    font-size: 2.6rem;
    letter-spacing: -1px;
  }

  .tagline {
    font-size: 1.2rem;
  }

  .hero {
    padding: 3rem 1.5rem;
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
    gap: 1rem;
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

/* ── ACCESIBILIDAD ── */
@media (prefers-reduced-motion: reduce) {

  .ghost,
  .t-cursor,
  .fade-in-up {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
