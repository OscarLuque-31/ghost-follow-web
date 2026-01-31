import { ref } from 'vue'
import api from '@/services/api'

export interface Stats {
  totalFollowers: number
  gainedCount: number
  lostCount: number
}

export interface FollowerItem {
  name: string
  url: string
  followDate?: string
}

export interface AnalysisResult {
  stats: Stats
  newFollowers: FollowerItem[]
  lostFollowers: FollowerItem[]
}

export function useFollowerAnalysis() {
  const analysisResults = ref<AnalysisResult | null>(null)
  const isLoading = ref(false)
  const showResults = ref(false)
  const apiError = ref('')

  const uploadAnalysis = async (file: File, accountName: string) => {
    if (!file || !accountName) return

    isLoading.value = true
    apiError.value = ''

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/followers/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        params: { accountName },
      })

      analysisResults.value = response.data
      showResults.value = true
    } catch (error: any) {
      const errorMsg = error.response?.data || error.message || '❌ Error al procesar el archivo.'
      apiError.value = typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const resetAnalysis = () => {
    showResults.value = false
    analysisResults.value = null
    apiError.value = ''
  }

  return {
    analysisResults,
    isLoading,
    showResults,
    apiError,
    uploadAnalysis,
    resetAnalysis,
  }
}
