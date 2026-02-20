<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'

const billingCycle = ref<'monthly' | 'lifetime'>('monthly')
const isLoading = ref(false)
const errorMsg = ref('')

const selectPlan = async (plan: string) => {
  isLoading.value = true
  errorMsg.value = ''

  try {
    // 1. Llamamos a tu nuevo endpoint limpio
    const response = await api.post('/payments/create-checkout-session', {
      planType: plan
    })

    // 2. Si todo va bien, recibimos la URL de Stripe
    const checkoutUrl = response.data.url

    if (checkoutUrl) {
      // 3. Redirigimos al usuario a la página de pago de Stripe
      window.location.href = checkoutUrl
    } else {
      errorMsg.value = 'No se pudo obtener la URL de pago.'
    }
  } catch (error: any) {
    console.error('Error al ir al pago:', error)
    // Mostramos el mensaje limpio que nos manda tu GlobalExceptionHandler
    errorMsg.value = error.response?.data?.message || 'Ocurrió un error al conectar con la pasarela de pago.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="pricing-container fade-in">
    <div class="header">
      <h2>Elige tu Plan 🚀</h2>
      <p>Desbloquea todo el potencial de GhostFollow</p>
    </div>

    <div class="toggle-container">
      <button :class="{ active: billingCycle === 'monthly' }" @click="billingCycle = 'monthly'">
        Mensual
      </button>
      <button :class="{ active: billingCycle === 'lifetime' }" @click="billingCycle = 'lifetime'">
        De por vida 🔥
      </button>
    </div>

    <div class="plans-grid">
      <div class="plan-card">
        <div class="plan-header">
          <h3>Básico</h3>
          <div class="price">0€<span>/mes</span></div>
          <p class="plan-desc">Para probar el servicio.</p>
        </div>

        <div class="divider"></div>

        <ul class="features">
          <li><span class="icon">✅</span> Análisis básico de archivo</li>
          <li><span class="icon">✅</span> Ver estadísticas generales</li>
          <li class="disabled"><span class="icon">❌</span> Historial de cambios</li>
          <li class="disabled"><span class="icon">❌</span> Detección de Traidores/Fans</li>
          <li class="disabled"><span class="icon">❌</span> Lista detallada de seguidores</li>
        </ul>
        <button class="btn-current" disabled>Tu plan actual</button>
      </div>

      <div class="plan-card premium">
        <div class="badge">RECOMENDADO</div>
        <div class="plan-header">
          <h3>Premium</h3>
          <div class="price-container">
            <div class="price" v-if="billingCycle === 'monthly'">2.99€<span>/mes</span></div>
            <div class="price" v-else>14.99€<span>/único</span></div>
            <div v-if="billingCycle === 'lifetime'" class="savings-tag">¡Pagas una vez!</div>
          </div>
          <p class="plan-desc">Acceso total a todas las herramientas.</p>
        </div>

        <div class="divider premium-divider"></div>

        <ul class="features">
          <li><span class="icon">✨</span> <strong>Todo lo del plan Básico</strong></li>
          <li><span class="icon">✅</span> Historial de análisis ilimitado</li>
          <li><span class="icon">✅</span> Descubre quién no te sigue (Traidores)</li>
          <li><span class="icon">✅</span> Descubre a tus Fans</li>
          <li><span class="icon">✅</span> Filtros avanzados y búsqueda</li>
          <li><span class="icon">✅</span> Soporte prioritario</li>
        </ul>

        <div v-if="errorMsg" class="error-msg">
          {{ errorMsg }}
        </div>

        <button class="btn-cta" :disabled="isLoading"
          @click="selectPlan(billingCycle === 'monthly' ? 'PREMIUM_MONTHLY' : 'PREMIUM_LIFETIME')">
          {{ isLoading ? 'Redirigiendo de forma segura...' : 'Obtener Premium ⭐' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========================================= */
/* 🖥️ ESTILOS ESCRITORIO                     */
/* ========================================= */
.pricing-container {
  width: 100%;
  max-width: 900px;
  padding: 3rem 2rem;
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid #f1f5f9;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.header h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.header p {
  color: #64748b;
  font-size: 1.1rem;
}

/* TOGGLE */
.toggle-container {
  display: flex;
  justify-content: center;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 50px;
  width: fit-content;
  margin: 0 auto 3rem;
  border: 1px solid #e2e8f0;
}

.toggle-container button {
  padding: 10px 32px;
  border-radius: 50px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  color: #64748b;
  font-size: 1rem;
}

.toggle-container button.active {
  background: white;
  color: #e91e63;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* GRID DE TARJETAS */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  align-items: stretch;
  /* Ambas tarjetas de la misma altura */
}

/* TARJETAS */
.plan-card {
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
  transition: transform 0.3s;
}

.plan-card.premium {
  border: 2px solid #fbcfe8;
  background: #fff1f2;
  position: relative;
  box-shadow: 0 20px 40px -10px rgba(233, 30, 99, 0.15);
  transform: scale(1.03);
  /* Ligeramente más grande */
}

/* CABECERAS DE TARJETAS */
.badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 10px rgba(233, 30, 99, 0.3);
}

.plan-header {
  text-align: center;
}

.plan-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.plan-desc {
  color: #64748b;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

/* PRECIOS */
.price-container {
  position: relative;
  display: inline-block;
}

.price {
  font-size: 3.5rem;
  font-weight: 900;
  color: #1e293b;
  margin: 0;
  line-height: 1;
  letter-spacing: -1px;
}

.price span {
  font-size: 1.2rem;
  color: #64748b;
  font-weight: 600;
  letter-spacing: normal;
}

.savings-tag {
  color: #16a34a;
  background: #dcfce7;
  font-size: 0.8rem;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 12px;
  display: inline-block;
  margin-top: 8px;
}

/* SEPARADORES */
.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 2rem 0;
  width: 100%;
}

.premium-divider {
  background: #fbcfe8;
}

/* CARACTERÍSTICAS */
.features {
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.features li {
  font-size: 0.95rem;
  color: #334155;
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
}

.features .icon {
  margin-right: 10px;
  flex-shrink: 0;
  font-size: 1.1rem;
}

.features li.disabled {
  color: #94a3b8;
}

.features li.disabled .icon {
  filter: grayscale(100%) opacity(0.5);
}

/* ERRORES */
.error-msg {
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  text-align: center;
  font-weight: 600;
}

/* BOTONES */
.btn-current {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #e2e8f0;
  color: #64748b;
  font-weight: 700;
  font-size: 1rem;
  margin-top: auto;
}

.btn-cta {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: linear-gradient(135deg, #e91e63, #db2777);
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.3);
  margin-top: auto;
}

.btn-cta:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(233, 30, 99, 0.4);
}

.btn-cta:active:not(:disabled) {
  transform: translateY(0);
}

.btn-cta:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  background: #f48fb1;
  box-shadow: none;
}

/* ANIMACIÓN */
.fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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

/* ========================================= */
/* 📱 OPTIMIZACIONES MÓVILES                 */
/* ========================================= */
@media (max-width: 768px) {

  /* Reset del contenedor para que use el ancho total de la pantalla */
  .pricing-container {
    padding: 1.5rem 1rem;
    border-radius: 0;
    border: none;
    box-shadow: none;
    background: transparent;
  }

  .header h2 {
    font-size: 1.8rem;
  }

  .header p {
    font-size: 1rem;
  }

  /* Ajuste del Toggle */
  .toggle-container {
    width: 100%;
  }

  .toggle-container button {
    flex: 1;
    padding: 10px 0;
  }

  /* Botones ocupan 50/50 */

  .plans-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .plan-card.premium {
    transform: none;
  }

  .plan-card {
    padding: 1.5rem;
  }

  .price {
    font-size: 2.8rem;
  }
}
</style>
