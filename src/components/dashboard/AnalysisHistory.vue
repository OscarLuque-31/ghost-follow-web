<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HistoryChart from '@/components/dashboard/HistoryChart.vue'
import { useHistoryStats } from '@/composables/useAnalysisHistory'

const props = defineProps<{ accountName: string }>()

const { historyData, isLoadingHistory, errorHistory, fetchHistory } = useHistoryStats()

const timeRange = ref<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('ALL')

const filteredHistory = computed(() => {
  if (!historyData.value || historyData.value.length === 0) return []

  if (timeRange.value === 'ALL') return historyData.value

  const now = new Date()
  const cutoffDate = new Date()

  switch (timeRange.value) {
    case '1M':
      cutoffDate.setMonth(now.getMonth() - 1)
      break
    case '3M':
      cutoffDate.setMonth(now.getMonth() - 3)
      break
    case '6M':
      cutoffDate.setMonth(now.getMonth() - 6)
      break
    case '1Y':
      cutoffDate.setFullYear(now.getFullYear() - 1)
      break
  }

  return historyData.value.filter(point => new Date(point.date) >= cutoffDate)
})

onMounted(() => {
  if (props.accountName) {
    fetchHistory(props.accountName)
  }
})
</script>

<template>
  <div class="history-container fade-in">
    <div class="header-section">
      <h2>📊 Historial de Crecimiento</h2>
      <p>Evolución de tus seguidores a lo largo del tiempo.</p>
    </div>

    <div v-if="isLoadingHistory" class="loading-state">
      <span class="loader"></span> Cargando datos...
    </div>

    <div v-else-if="errorHistory" class="error-state">
      {{ errorHistory }}
    </div>

    <div v-else-if="historyData.length < 2" class="empty-state">
      <div class="icon">📉</div>
      <p>Necesitas subir al menos <strong>2 archivos</strong> en fechas distintas.</p>
    </div>

    <div v-else class="chart-section">

      <div class="filter-bar">
        <button @click="timeRange = '1M'" :class="{ active: timeRange === '1M' }">1 Mes</button>
        <button @click="timeRange = '3M'" :class="{ active: timeRange === '3M' }">3 Meses</button>
        <button @click="timeRange = '6M'" :class="{ active: timeRange === '6M' }">6 Meses</button>
        <button @click="timeRange = '1Y'" :class="{ active: timeRange === '1Y' }">1 Año</button>
        <button @click="timeRange = 'ALL'" :class="{ active: timeRange === 'ALL' }">Todo</button>
      </div>

      <div class="chart-card">
        <HistoryChart :history-data="filteredHistory" />
      </div>

      <p class="range-info">
        Mostrando {{ filteredHistory.length }} análisis en este periodo.
      </p>
    </div>
  </div>
</template>

<style scoped>
.history-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.header-section {
  text-align: center;
}

.header-section h2 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.header-section p {
  color: #64748b;
}

.chart-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* ESTILOS DE LOS FILTROS */
.filter-bar {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.filter-bar button {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #64748b;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.filter-bar button:hover {
  border-color: #e91e63;
  color: #e91e63;
}

.filter-bar button.active {
  background: #e91e63;
  color: white;
  border-color: #e91e63;
  box-shadow: 0 4px 6px rgba(233, 30, 99, 0.2);
}

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid white;
  height: 400px;
}

.range-info {
  text-align: center;
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: -10px;
}

/* ... Resto de loader, errors, fade-in ... */
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 16px;
  color: #64748b;
}

.error-state {
  color: #ef4444;
  background: #fef2f2;
}

.empty-state .icon {
  font-size: 3rem;
  margin-bottom: 1rem;
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
