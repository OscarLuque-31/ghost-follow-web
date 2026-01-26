<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import HistoryChart from '@/components/dashboard/HistoryChart.vue'
import { useHistoryStats } from '@/composables/useAnalysisHistory'
const props = defineProps<{ accountName: string }>()

const { historyData, isLoadingHistory, errorHistory, fetchHistory } = useHistoryStats()

const timeRange = ref<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL')
const windowWidth = ref(window.innerWidth)

const updateWidth = () => {
  windowWidth.value = window.innerWidth
}

const filteredHistory = computed(() => {
  if (!historyData.value || historyData.value.length === 0) return []
  if (timeRange.value === 'ALL') return historyData.value

  const now = new Date()
  const cutoffDate = new Date()

  switch (timeRange.value) {
    case '1M': cutoffDate.setMonth(now.getMonth() - 1); break;
    case '3M': cutoffDate.setMonth(now.getMonth() - 3); break;
    case '6M': cutoffDate.setMonth(now.getMonth() - 6); break;
    case '1Y': cutoffDate.setFullYear(now.getFullYear() - 1); break;
  }

  return historyData.value.filter(point => new Date(point.date) >= cutoffDate)
})

const chartWidthStyle = computed(() => {
  const points = filteredHistory.value.length

  if (windowWidth.value > 600) return { width: '100%' }
  if (points <= 5) return { width: '100%' }

  return { width: `${Math.max(100, points * 50)}px` }
})

onMounted(() => {
  window.addEventListener('resize', updateWidth)
  if (props.accountName) {
    fetchHistory(props.accountName)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth)
})
</script>

<template>
  <div class="history-container fade-in">
    <div class="header-section">
      <h2>📊 Historial</h2>
      <p>Evolución de tus seguidores.</p>
    </div>

    <div v-if="isLoadingHistory" class="loading-state"><span class="loader"></span> Cargando...</div>
    <div v-else-if="errorHistory" class="error-state">{{ errorHistory }}</div>
    <div v-else-if="historyData.length < 2" class="empty-state">
      <div class="icon">📉</div>
      <p>Necesitas más datos para ver la gráfica.</p>
    </div>

    <div v-else class="chart-section">
      <div class="filter-bar">
        <button @click="timeRange = '1M'" :class="{ active: timeRange === '1M' }">1M</button>
        <button @click="timeRange = '3M'" :class="{ active: timeRange === '3M' }">3M</button>
        <button @click="timeRange = '6M'" :class="{ active: timeRange === '6M' }">6M</button>
        <button @click="timeRange = '1Y'" :class="{ active: timeRange === '1Y' }">1A</button>
        <button @click="timeRange = 'ALL'" :class="{ active: timeRange === 'ALL' }">Todo</button>
      </div>

      <div class="chart-card">
        <div class="chart-scroll-wrapper">
          <div class="chart-dynamic-width" :style="chartWidthStyle">
            <HistoryChart :history-data="filteredHistory" />
          </div>
        </div>
      </div>

      <p class="range-info">Mostrando {{ filteredHistory.length }} registros</p>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header-section {
  text-align: center;
}

.header-section h2 {
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
  color: #2c3e50;
}

.header-section p {
  color: #64748b;
  font-size: 0.9rem;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.filter-bar {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-bar button {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 5px 20px;
  border-radius: 16px;
  font-size: 0.8rem;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
}

.filter-bar button.active {
  background: #e91e63;
  color: white;
  border-color: #e91e63;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* CONTENEDOR DE SCROLL */
.chart-scroll-wrapper {
  flex: 1;
  width: 100%;
  max-width: 100%;

  overflow-x: auto;
  overflow-y: hidden;

  -webkit-overflow-scrolling: touch;
}

/* CONTENEDOR INTERNO DINÁMICO */
.chart-dynamic-width {
  height: 100%;
  position: relative;
}

/* ESTILOS MÓVIL */
@media (max-width: 600px) {
  .chart-card {
    padding: 10px;
  }

  .chart-scroll-wrapper {
    padding-bottom: 5px;
  }
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  color: #64748b;
  font-size: 0.9rem;
}

.error-state {
  color: #ef4444;
  background: #fef2f2;
}

.loader {
  display: inline-block;
  width: 15px;
  height: 15px;
  border: 2px solid #cbd5e1;
  border-radius: 50%;
  border-top-color: #e91e63;
  animation: spin 1s linear infinite;
  margin-right: 8px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.range-info {
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
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
