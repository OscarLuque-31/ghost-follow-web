<script setup lang="ts">
</script>

<template>
  <div class="page-root">

    <div class="fixed-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="scrollable-content fade-in">
      <div class="content-container">

        <section class="glass-card hero-section fade-in-up">
          <div class="ghost-animation">👻</div>
          <h1>GhostFollow</h1>
          <p class="tagline">Toma el control absoluto de tu Instagram.</p>
          <p class="sub-tagline">Descubre quién te dejó de seguir, quiénes son tus verdaderos fans y analiza tu
            crecimiento con exactitud milimétrica.</p>

          <div class="buttons">
            <router-link to="/login" class="btn btn-primary">Entrar al Panel</router-link>
            <router-link to="/register" class="btn btn-outline">Crear Cuenta Gratis</router-link>
          </div>
        </section>

        <section class="features-grid fade-in-up" style="animation-delay: 0.2s;">
          <div class="feature-item">
            <div class="icon">💔</div>
            <h3>Fans & Traidores</h3>
            <p>Cruza datos al instante. Detecta quién no te devuelve el follow y quién te sigue fielmente.</p>
          </div>
          <div class="feature-item">
            <div class="icon">📈</div>
            <h3>Historial Evolutivo</h3>
            <p>Guarda tus reportes en la nube. Compara tu crecimiento real mes a mes sin perder datos.</p>
          </div>
          <div class="feature-item">
            <div class="icon">🔔</div>
            <h3>Alertas por Email</h3>
            <p>Recibe notificaciones automáticas y resúmenes directos a tu correo al instante.</p>
          </div>
        </section>

        <section class="how-it-works glass-card-light fade-in-up" style="animation-delay: 0.3s;">
          <h2>Empieza en menos de 1 minuto</h2>
          <div class="steps-container">
            <div class="steps">
              <div class="step">
                <span class="step-num">1</span>
                <div class="step-text">
                  <h4>Regístrate sin tarjeta</h4>
                  <p>Solo necesitas tu email y tu usuario de IG. Es 100% seguro.</p>
                </div>
              </div>
              <div class="step">
                <span class="step-num">2</span>
                <div class="step-text">
                  <h4>Sube tu archivo .zip</h4>
                  <p>Descarga tus datos oficiales de Instagram y súbelos. <b>Nosotros no pedimos tu contraseña de
                      IG.</b></p>
                </div>
              </div>
              <div class="step">
                <span class="step-num">3</span>
                <div class="step-text">
                  <h4>Desbloquea el panel</h4>
                  <p>Accede a métricas que la app oficial te oculta. ¡Encuentra a los fantasmas!</p>
                </div>
              </div>
            </div>

            <div class="code-preview">
              <div class="mac-buttons"><span></span><span></span><span></span></div>
              <p class="code-line"><span class="prompt">></span> Analizando followers.zip...</p>
              <p class="code-line success"><span class="prompt">></span> 1,204 seguidores encontrados.</p>
              <p class="code-line alert"><span class="prompt">></span> ¡Alerta! 3 usuarios te dejaron de seguir.</p>
              <p class="code-line"><span class="prompt">></span> Generando reporte en el Dashboard...</p>
            </div>
          </div>
        </section>

        <footer class="simple-footer fade-in">
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
}

.page-root {
  width: 100%;
  font-family: 'Inter', sans-serif;
}

/* 1. Fondo fijo con aceleración de hardware */
.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #fbcfe8 100%);
  z-index: -1;
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.scrollable-content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
}

.content-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 0 auto;
}

/* 2. Manchas con aceleración gráfica (translate3d) */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: moveBlob 12s infinite alternate ease-in-out;
  transform: translate3d(0, 0, 0);
  will-change: transform;
}

.blob-1 {
  width: 70vw;
  height: 70vw;
  background-color: #f9a8d4;
  top: -10%;
  left: -10%;
}

.blob-2 {
  width: 60vw;
  height: 60vw;
  background-color: #fdf2f8;
  bottom: -10%;
  right: -10%;
  animation-delay: -6s;
}

@keyframes float {

  0%,
  100% {
    transform: translate3d(0, 0px, 0);
  }

  50% {
    transform: translate3d(0, -15px, 0);
  }
}

@keyframes moveBlob {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }

  100% {
    transform: translate3d(30px, 30px, 0) scale(1.05);
  }
}

/* 3. Tarjetas de cristal optimizadas */
.glass-card {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 20px 40px -10px rgba(233, 30, 99, 0.15);
  overflow: hidden;
  transform: translateZ(0);
  will-change: transform, backdrop-filter;
}

.ghost-animation {
  font-size: 5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 10px rgba(233, 30, 99, 0.2));
}

h1 {
  font-size: 3.5rem;
  margin: 0 0 0.5rem 0;
  color: #831843;
  font-weight: 800;
  letter-spacing: -1.5px;
}

.tagline {
  font-size: 1.4rem;
  color: #be185d;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.sub-tagline {
  font-size: 1.05rem;
  color: #64748b;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

/* BUTTONS */
.buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 700;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 1.05rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: linear-gradient(135deg, #e91e63 0%, #db2777 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(233, 30, 99, 0.35);
}

.btn-outline {
  background-color: rgba(255, 255, 255, 0.5);
  color: #db2777;
  border: 2px solid #f472b6;
}

.btn-outline:hover {
  background-color: #fce7f3;
  border-color: #db2777;
  transform: translateY(-2px);
}

/* FEATURES GRID */
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-item {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  padding: 2rem 1.5rem;
  border-radius: 24px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px -5px rgba(0, 0, 0, 0.05);
  transform: translateZ(0);
  will-change: transform, backdrop-filter;
}

.feature-item:hover {
  transform: translate3d(0, -5px, 0);
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 10px 25px -5px rgba(233, 30, 99, 0.15);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: inline-block;
  transform-origin: bottom center;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.feature-item:hover .icon {
  transform: scale(1.15) rotate(-5deg);
}

.feature-item h3 {
  color: #831843;
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  font-weight: 700;
}

.feature-item p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
  line-height: 1.5;
}

/* HOW IT WORKS */
.glass-card-light {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 28px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  padding: 3rem;
  box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.05);
  transform: translateZ(0);
  will-change: transform, backdrop-filter;
}

.glass-card-light h2 {
  color: #831843;
  margin-top: 0;
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
}

.steps-container {
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
  align-items: flex-start;
  gap: 1.2rem;
}

.step-num {
  background: linear-gradient(135deg, #e91e63 0%, #db2777 100%);
  color: white;
  width: 35px;
  height: 35px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  flex-shrink: 0;
  font-size: 1.1rem;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
}

.step-text h4 {
  margin: 0 0 0.2rem 0;
  color: #831843;
  font-weight: 700;
  font-size: 1.05rem;
}

.step-text p {
  margin: 0;
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.4;
}

/* ANIMACIONES Y UTILIDADES */
.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}

/* FAKE TERMINAL */
.code-preview {
  background: #1e293b;
  border-radius: 16px;
  padding: 1.5rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.85rem;
  color: #e2e8f0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid #0f172a;
}

.mac-buttons {
  display: flex;
  gap: 6px;
  margin-bottom: 1rem;
}

.mac-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.mac-buttons span:nth-child(1) {
  background: #ef4444;
}

.mac-buttons span:nth-child(2) {
  background: #eab308;
}

.mac-buttons span:nth-child(3) {
  background: #22c55e;
}

.code-line {
  margin: 0.5rem 0;
  line-height: 1.4;
  opacity: 0.9;
}

.prompt {
  color: #db2777;
  font-weight: bold;
  margin-right: 8px;
}

.success {
  color: #10b981;
}

.alert {
  color: #f43f5e;
  font-weight: bold;
}

.simple-footer {
  text-align: center;
  color: #9d174d;
  opacity: 0.8;
  font-size: 0.9rem;
  font-weight: 500;
  margin-top: 2rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  h1 {
    font-size: 2.8rem;
  }

  .tagline {
    font-size: 1.2rem;
  }

  .buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .steps-container {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .code-preview {
    display: none;
  }

  /* Ocultar terminal en móvil para ahorrar espacio */

  .glass-card,
  .glass-card-light {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }

  /* 4. APAGAR ANIMACIONES EN MÓVIL PARA MAX FPS */
  .blob {
    animation: none !important;
    /* Al quitar la animación, forzamos un repintado estático final */
    transform: translateZ(0);
  }
}
</style>
