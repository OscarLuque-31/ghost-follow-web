<script setup lang="ts">
import { computed } from 'vue'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface HistoryPoint {
  date: string
  totalFollowers: number
}

const props = defineProps<{
  historyData: HistoryPoint[]
}>()

const chartData = computed(() => {
  const sortedData = [...props.historyData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return {
    labels: sortedData.map(point =>
      new Date(point.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })
    ),
    datasets: [
      {
        label: 'Seguidores',
        borderColor: '#e91e63',
        backgroundColor: 'rgba(233, 30, 99, 0.1)',
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#e91e63',
        pointHoverBackgroundColor: '#e91e63',
        pointHoverBorderColor: '#ffffff',
        data: sortedData.map(point => point.totalFollowers),
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#1e293b',
      bodyColor: '#e91e63',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        label: (context: any) => `Seguidores: ${context.parsed.y}`
      }
    }
  },
  scales: {
    y: {
      grid: {
        color: '#f1f5f9',
        drawBorder: false
      },
      ticks: {
        color: '#94a3b8',
        font: { family: "'Inter', sans-serif" }
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#94a3b8',
        font: { family: "'Inter', sans-serif" }
      }
    }
  },
  interaction: {
    intersect: false,
    mode: 'index' as const,
  },
}
</script>

<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 300px;
}
</style>
