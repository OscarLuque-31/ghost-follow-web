<script setup lang="ts">
import { onMounted } from 'vue'
import HistoryChart from '@/components/dashboard/HistoryChart.vue'
import { useHistoryStats } from '@/composables/useAnalysisHistory'

const props = defineProps<{ accountName: string }>()

const { historyData, isLoadingHistory, errorHistory, fetchHistory } = useHistoryStats()

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
      <p>Necesitas subir al menos <strong>2 archivos</strong> en fechas distintas para ver una gráfica de evolución.</p>
    </div>

    <div v-else class="chart-card">
      <HistoryChart :history-data="historyData" />
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

.chart-card {
  background: white;
  padding: 2rem;
  border-radius: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border: 1px solid white;
  height: 400px;
}

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
