<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits(['close'])

const billingCycle = ref<'monthly' | 'lifetime'>('monthly')

const selectPlan = (plan: string) => {
  // AQUÍ INTEGRARÍAS STRIPE O TU PASARELA DE PAGO
  console.log('Plan seleccionado:', plan)
  alert(`Redirigiendo al pago de: ${plan}...`)
}
</script>

<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content fade-in">
      <button class="close-btn" @click="$emit('close')">&times;</button>

      <div class="header">
        <h2>Elige tu Plan 🚀</h2>
        <p>Desbloquea todo el potencial de GhostFollow</p>
      </div>

      <div class="toggle-container">
        <button :class="{ active: billingCycle === 'monthly' }" @click="billingCycle = 'monthly'">Mensual</button>
        <button :class="{ active: billingCycle === 'lifetime' }" @click="billingCycle = 'lifetime'">De por vida
          🔥</button>
      </div>

      <div class="plans-grid">
        <div class="plan-card">
          <div class="plan-header">
            <h3>Gratis</h3>
            <div class="price">0€<span>/mes</span></div>
          </div>
          <ul class="features">
            <li>✅ Análisis básico de archivo</li>
            <li>✅ Ver estadísticas generales</li>
            <li class="disabled">❌ Historial de cambios</li>
            <li class="disabled">❌ Detección de Traidores/Fans</li>
            <li class="disabled">❌ Lista detallada de seguidores</li>
          </ul>
          <button class="btn-current" disabled>Tu plan actual</button>
        </div>

        <div class="plan-card premium">
          <div class="badge">RECOMENDADO</div>
          <div class="plan-header">
            <h3>Premium</h3>
            <div class="price" v-if="billingCycle === 'monthly'">4.99€<span>/mes</span></div>
            <div class="price" v-else>29.99€<span>/único</span></div>
          </div>
          <ul class="features">
            <li>✅ <strong>Todo lo del plan Gratis</strong></li>
            <li>✅ Historial de análisis ilimitado</li>
            <li>✅ Descubre quién no te sigue (Traidores)</li>
            <li>✅ Descubre a tus Fans</li>
            <li>✅ Filtros avanzados y búsqueda</li>
            <li>✅ Soporte prioritario</li>
          </ul>
          <button class="btn-cta"
            @click="selectPlan(billingCycle === 'monthly' ? 'PREMIUM_MONTHLY' : 'PREMIUM_LIFETIME')">
            Mejorar Plan ⭐
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 850px;
  border-radius: 20px;
  padding: 2rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #64748b;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h2 {
  font-size: 2rem;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.header p {
  color: #64748b;
}

.toggle-container {
  display: flex;
  justify-content: center;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 50px;
  width: fit-content;
  margin: 0 auto 2rem;
}

.toggle-container button {
  padding: 8px 24px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  background: transparent;
  color: #64748b;
}

.toggle-container button.active {
  background: white;
  color: #e91e63;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.plans-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.plan-card {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.plan-card.premium {
  border: 2px solid #e91e63;
  background: #fff1f2;
  position: relative;
  transform: scale(1.02);
  box-shadow: 0 10px 15px -3px rgba(233, 30, 99, 0.1);
}

.badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #e91e63;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 1rem 0;
}

.price span {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  flex: 1;
  text-align: left;
}

.features li {
  margin-bottom: 0.8rem;
  font-size: 0.95rem;
  color: #334155;
}

.features li.disabled {
  color: #94a3b8;
  text-decoration: line-through;
  opacity: 0.7;
}

.btn-current {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #e2e8f0;
  color: #64748b;
  font-weight: bold;
}

.btn-cta {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #e91e63;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(233, 30, 99, 0.3);
}

@media (max-width: 768px) {
  .plans-grid {
    grid-template-columns: 1fr;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
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
