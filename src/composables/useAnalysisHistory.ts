import { ref } from 'vue'
import api from '@/services/api'

export interface HistoryPoint {
  date: string
  totalFollowers: number
  gained: number
  lost: number
}

export function useHistoryStats() {
  const historyData = ref<HistoryPoint[]>([])
  const isLoadingHistory = ref(false)
  const errorHistory = ref('')

  const fetchHistory = async (accountName: string) => {
    if (!accountName) return

    isLoadingHistory.value = true
    errorHistory.value = ''

    try {
      const response = await api.get('/history')

      historyData.value = response.data
    } catch (error: any) {
      console.error('Error cargando historial:', error)
      errorHistory.value = 'No se pudieron cargar los datos del historial.'
    } finally {
      isLoadingHistory.value = false
    }
  }

  return {
    historyData,
    isLoadingHistory,
    errorHistory,
    fetchHistory,
  }
}
