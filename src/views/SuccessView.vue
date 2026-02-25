<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'

const router = useRouter()
const { fetchUser } = useUser()
const isRefreshing = ref(true)

onMounted(async () => {
  try {
    await fetchUser()
  } catch (error) {
    console.error('Error refrescando usuario tras la compra:', error)
  } finally {
    isRefreshing.value = false
  }
})

const goToDashboard = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="success-page-wrapper">
    <div class="success-card fade-in-up">

      <div class="icon-container">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
          <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
        </svg>
      </div>

      <h1 class="title">¡Pago Completado!</h1>
      <p class="subtitle">
        Muchísimas gracias por confiar en nosotros. Tu cuenta ha sido actualizada a <strong>Premium 💎</strong>.
      </p>

      <div class="perks-box">
        <p>Ya puedes disfrutar de:</p>
        <ul>
          <li>✨ Acceso a todas las herramientas avanzadas.</li>
          <li>📊 Análisis y reportes sin límites.</li>
          <li>🚀 Soporte prioritario.</li>
        </ul>
      </div>

      <button @click="goToDashboard" class="btn-primary" :disabled="isRefreshing">
        {{ isRefreshing ? 'Preparando tu cuenta...' : 'Ir a mi panel' }}
      </button>

    </div>
  </div>
</template>

<style scoped>
.success-page-wrapper {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.success-card {
  background: white;
  max-width: 500px;
  width: 100%;
  padding: 3rem 2rem;
  border-radius: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
  text-align: center;
  border: 1px solid #f1f5f9;
}

.icon-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.5;
  margin-bottom: 2rem;
}

.perks-box {
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: left;
  margin-bottom: 2.5rem;
  border: 1px solid #e2e8f0;
}

.perks-box p {
  font-weight: 700;
  color: #334155;
  margin-bottom: 10px;
}

.perks-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.perks-box li {
  color: #475569;
  font-size: 0.95rem;
}

.btn-primary {
  width: 100%;
  padding: 16px;
  background: #e91e63;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.25);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(233, 30, 99, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: wait;
  transform: none;
}

/* ANIMACIÓN DEL CHECKMARK (Estilo Stripe) */
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #10b981;
  /* Verde éxito */
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  margin: 0 auto;
  box-shadow: inset 0px 0px 0px #10b981;
  animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes scale {

  0%,
  100% {
    transform: none;
  }

  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
}

@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 50px #10b981;
  }
}

.fade-in-up {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
