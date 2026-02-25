import { ref, computed } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

export enum PlanType {
  FREE = 'FREE',
  PREMIUM_MONTHLY = 'PREMIUM_MONTHLY',
  PREMIUM_LIFETIME = 'PREMIUM_LIFETIME',
}

export interface Subscription {
  planType: PlanType
  status: string
  startDate: string
  currentPeriodEnd: string
}

export interface User {
  instagramUserName: string
  email: string
  hasInitialData: boolean
  subscription: Subscription
}

const user = ref<User | null>(null)
const loadingUser = ref(false)

export function useUser() {
  const router = useRouter()

  const isPremium = computed(() => {
    if (!user.value) return false

    const plan = user.value.subscription.planType
    const status = user.value.subscription.status
    const currentPeriodEnd = user.value.subscription.currentPeriodEnd

    if (plan === PlanType.FREE) return false

    if (status === 'ACTIVE') return true

    if (status === 'CANCELED' && currentPeriodEnd) {
      const endDate = new Date(currentPeriodEnd)
      const now = new Date()
      return endDate > now
    }

    return false
  })

  const fetchUser = async () => {
    loadingUser.value = true
    try {
      const { data } = await api.get<User>('/auth/me')
      user.value = data
    } catch (error) {
      console.error(error)
      logout()
    } finally {
      loadingUser.value = false
    }
  }

  const logout = () => {
    localStorage.removeItem('jwt_token')
    user.value = null
    router.push('/login')
  }

  return {
    user,
    loadingUser,
    isPremium,
    fetchUser,
    logout,
  }
}
