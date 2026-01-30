import { ref } from 'vue'
import api from '@/services/api'

export interface FollowerDto {
  name: string
  followDate: string
  url: string
}

export function useCurrentFollowers() {
  const followersList = ref<FollowerDto[]>([])
  const isLoadingList = ref(false)
  const errorList = ref('')

  const fetchFollowersList = async () => {
    isLoadingList.value = true
    errorList.value = ''

    try {
      const response = await api.get('/followers')
      followersList.value = response.data
    } catch (e) {
      console.error('Error cargando seguidores:', e)
      errorList.value = 'No se pudo cargar la lista de seguidores.'
    } finally {
      isLoadingList.value = false
    }
  }

  return {
    followersList,
    isLoadingList,
    errorList,
    fetchFollowersList,
  }
}
