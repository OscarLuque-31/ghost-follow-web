<script setup lang="ts">
defineProps<{ visible: boolean }>()
</script>

<template>
  <div v-if="visible" class="info-box welcome-box fade-in">
    <h3>🎉 ¡Bienvenido a GhostFollow!</h3>
    <p>
      Acabamos de guardar tu lista actual como <strong>Línea Base</strong>.
      <br />
      La próxima vez que subas un archivo (en unos días), lo compararemos con esta versión para
      decirte quién te ha dejado de seguir.
    </p>
  </div>
</template>

<style scoped>
.info-box {
  padding: 20px;
  border-radius: 16px;
  text-align: center;
  margin: 20px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  max-width: 550px;
  margin-bottom: 25px;
}

.info-box h3 {
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.info-box p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}

.welcome-box {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  border: 1px solid #90caf9;
  color: #0d47a1;
}

.fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
