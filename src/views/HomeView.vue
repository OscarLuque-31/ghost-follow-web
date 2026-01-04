<script setup lang="ts">
</script>

<template>
  <div class="page-root">

    <div class="fixed-background">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>

    <div class="scrollable-content">
      <div class="content-container">

        <section class="glass-card hero-section">
          <div class="ghost-animation">👻</div>
          <h1>GhostFollow</h1>
          <p class="tagline">Descubre quién te ha dejado de seguir en Instagram.</p>
          <p class="sub-tagline">Sin sorpresas. Con alertas por email.</p>

          <div class="buttons">
            <router-link to="/login" class="btn btn-primary">Iniciar Sesión</router-link>
            <router-link to="/register" class="btn btn-outline">Crear Cuenta</router-link>
          </div>
        </section>

        <section class="features-grid">
          <div class="feature-item">
            <div class="icon">🔒</div>
            <h3>100% Seguro</h3>
            <p>Tus datos no salen de aquí. Analizamos localmente.</p>
          </div>
          <div class="feature-item">
            <div class="icon">🔔</div>
            <h3>Alertas Reales</h3>
            <p>Recibe un email cuando alguien te deje de seguir.</p>
          </div>
          <div class="feature-item">
            <div class="icon">✨</div>
            <h3>Sin Complicaciones</h3>
            <p>Olvídate de métricas raras. Solo te decimos quién se fue.</p>
          </div>
        </section>

        <section class="how-it-works glass-card-light">
          <h2>¿Cómo funciona?</h2>
          <div class="steps">
            <div class="step">
              <span class="step-num">1</span>
              <p>Descarga tus datos desde Instagram</p>
            </div>
            <div class="step">
              <span class="step-num">2</span>
              <p>Sube el archivo <code>followers.json</code></p>
            </div>
            <div class="step">
              <span class="step-num">3</span>
              <p>¡Descubre a los fantasmas! 👻</p>
            </div>
          </div>
        </section>

        <footer class="simple-footer">
          <p>© 2025 GhostFollow</p>
        </footer>

      </div>
    </div>
  </div>
</template>

<style scoped>
.fixed-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  z-index: -1;
  overflow: hidden;
}

.page-root {
  width: 100%;
  font-family: 'Segoe UI', sans-serif;
}

.scrollable-content {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
}

.content-container {
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin: 0 auto;
}


.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
  animation: moveBlob 10s infinite alternate ease-in-out;
}

.blob-1 {
  width: 80vw;
  height: 80vw;
  background-color: #ffc1e3;
  top: -20%;
  left: -20%;
}

.blob-2 {
  width: 70vw;
  height: 70vw;
  background-color: #fff0f5;
  bottom: -20%;
  right: -20%;
  animation-delay: -5s;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-15px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes moveBlob {
  0% {
    transform: translate(0, 0) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0, 0) scale(1);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  padding: 50px 20px;
  text-align: center;
  box-shadow: 0 8px 32px 0 rgba(233, 30, 99, 0.15);
}

.ghost-animation {
  font-size: 5em;
  margin-bottom: 10px;
  display: inline-block;
  animation: float 3s ease-in-out infinite;
  filter: drop-shadow(0 10px 10px rgba(233, 30, 99, 0.2));
}

h1 {
  font-size: 3em;
  margin: 0 0 10px 0;
  color: #880e4f;
  font-weight: 800;
  line-height: 1.1;
}

.tagline {
  font-size: 1.25em;
  color: #c2185b;
  margin-bottom: 5px;
  font-weight: 600;
  line-height: 1.3;
}

.sub-tagline {
  font-size: 1em;
  color: #d81b60;
  opacity: 0.9;
  margin-bottom: 30px;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.btn {
  padding: 14px 30px;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 700;
  transition: all 0.3s ease;
  font-size: 1.05em;
}

.btn-primary {
  background-color: #e91e63;
  color: white;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  background-color: #d81b60;
}

.btn-outline {
  background-color: transparent;
  color: #e91e63;
  border: 2px solid #e91e63;
}

.btn-outline:hover {
  background-color: #e91e63;
  color: white;
  transform: translateY(-3px);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-item {
  background: rgba(255, 255, 255, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  transition: transform 0.3s;
}

.feature-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.6);
}

.icon {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.feature-item h3 {
  color: #880e4f;
  margin: 0 0 8px 0;
  font-size: 1.1em;
}

.feature-item p {
  color: #c2185b;
  font-size: 0.9em;
  margin: 0;
  line-height: 1.4;
}

.glass-card-light {
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 30px;
  text-align: center;
}

.glass-card-light h2 {
  color: #880e4f;
  margin-bottom: 25px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
  text-align: left;
}

.step {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.5);
  padding: 10px 15px;
  border-radius: 10px;
}

.step-num {
  background: #e91e63;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.step p {
  margin: 0;
  color: #880e4f;
  font-weight: 500;
}

.step code {
  background: #fce4ec;
  padding: 2px 6px;
  border-radius: 4px;
  color: #c2185b;
  font-size: 0.9em;
}

.simple-footer {
  text-align: center;
  color: #c2185b;
  opacity: 0.7;
  font-size: 0.9em;
  padding-bottom: 20px;
}

@media (max-width: 600px) {
  h1 {
    font-size: 2.5em;
  }

  .buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    text-align: center;
    box-sizing: border-box;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .glass-card,
  .glass-card-light {
    padding: 30px 20px;
  }
}
</style>
